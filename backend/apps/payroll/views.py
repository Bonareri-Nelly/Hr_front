from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.http import HttpResponse
from decimal import Decimal
from .models import (
    PayrollPolicy, TaxBand, StatutoryRate,
    PayComponent, EmployeePayComponent, PayrollRun, Payslip,
    Allowance, Deduction, BankPayment,
)
from .serializers import (
    PayrollPolicySerializer, TaxBandSerializer, StatutoryRateSerializer,
    PayComponentSerializer, EmployeePayComponentSerializer, PayrollRunSerializer,
    PayslipSerializer, AllowanceSerializer, DeductionSerializer, BankPaymentSerializer,
)
from apps.authentication.access import scope_employee_relation, can_manage_payroll


class PayrollPolicyViewSet(viewsets.ModelViewSet):
    queryset = PayrollPolicy.objects.all()
    serializer_class = PayrollPolicySerializer

    def perform_create(self, serializer):
        if not can_manage_payroll(self.request.user):
            raise PermissionDenied("You are not allowed to manage payroll policies.")
        serializer.save()


class TaxBandViewSet(viewsets.ModelViewSet):
    queryset = TaxBand.objects.all()
    serializer_class = TaxBandSerializer

    def perform_create(self, serializer):
        if not can_manage_payroll(self.request.user):
            raise PermissionDenied("You are not allowed to manage tax bands.")
        serializer.save()


class StatutoryRateViewSet(viewsets.ModelViewSet):
    queryset = StatutoryRate.objects.all()
    serializer_class = StatutoryRateSerializer

    def perform_create(self, serializer):
        if not can_manage_payroll(self.request.user):
            raise PermissionDenied("You are not allowed to manage statutory rates.")
        serializer.save()


class PayComponentViewSet(viewsets.ModelViewSet):
    queryset = PayComponent.objects.all()
    serializer_class = PayComponentSerializer

    def perform_create(self, serializer):
        if not can_manage_payroll(self.request.user):
            raise PermissionDenied("You are not allowed to manage pay components.")
        serializer.save()


class EmployeePayComponentViewSet(viewsets.ModelViewSet):
    queryset = EmployeePayComponent.objects.select_related("employee", "component").all()
    serializer_class = EmployeePayComponentSerializer

    def get_queryset(self):
        qs = scope_employee_relation(super().get_queryset(), self.request.user)
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs


class PayrollRunViewSet(viewsets.ModelViewSet):
    queryset = PayrollRun.objects.select_related("branch").all()
    serializer_class = PayrollRunSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if not (user.is_superuser or user.role in {"System Admin", "Executive", "HR", "Finance"}):
            qs = qs.filter(branch__name=user.branch_name)
        return qs.order_by("-created_at")

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        if not can_manage_payroll(request.user):
            raise PermissionDenied("You are not allowed to submit payroll.")
        run = self.get_object()
        run.status = "Submitted"
        run.save()
        return Response(PayrollRunSerializer(run).data)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        if not (request.user.is_superuser or request.user.role in {"System Admin", "Finance"}):
            raise PermissionDenied("Only Finance can approve payroll.")
        run = self.get_object()
        run.status = "Approved"
        run.save()
        return Response(PayrollRunSerializer(run).data)

    @action(detail=True, methods=["post"])
    def finalize(self, request, pk=None):
        if not (request.user.is_superuser or request.user.role in {"System Admin", "Finance"}):
            raise PermissionDenied("Only Finance can finalize payroll.")
        run = self.get_object()
        run.status = "Finalized"
        run.save()
        return Response(PayrollRunSerializer(run).data)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        if not can_manage_payroll(request.user):
            raise PermissionDenied("You are not allowed to cancel payroll.")
        run = self.get_object()
        run.status = "Cancelled"
        run.save()
        return Response(PayrollRunSerializer(run).data)


class PayslipViewSet(viewsets.ModelViewSet):
    queryset = Payslip.objects.select_related("employee", "payroll_run").all()
    serializer_class = PayslipSerializer

    def get_queryset(self):
        qs = scope_employee_relation(super().get_queryset(), self.request.user)
        employee = self.request.query_params.get("employee")
        payroll_run = self.request.query_params.get("payroll_run")
        if employee:
            qs = qs.filter(employee_id=employee)
        if payroll_run:
            qs = qs.filter(payroll_run_id=payroll_run)
        return qs.order_by("-created_at")

    @action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        payslip = self.get_object()
        content = f"""PAYSLIP
Employee: {payslip.employee_name}
Period: {payslip.payroll_run.period_start} to {payslip.payroll_run.period_end}
Gross Pay: {payslip.gross_pay}
Deductions: {payslip.total_deductions}
Net Pay: {payslip.net_pay}
"""
        response = HttpResponse(content, content_type="text/plain")
        response["Content-Disposition"] = f'attachment; filename="payslip_{pk}.txt"'
        return response


class AllowanceViewSet(viewsets.ModelViewSet):
    queryset = Allowance.objects.all()
    serializer_class = AllowanceSerializer


class DeductionViewSet(viewsets.ModelViewSet):
    queryset = Deduction.objects.all()
    serializer_class = DeductionSerializer


class BankPaymentViewSet(viewsets.ModelViewSet):
    queryset = BankPayment.objects.select_related("employee", "payslip", "payroll_run").all()
    serializer_class = BankPaymentSerializer

    def get_queryset(self):
        qs = scope_employee_relation(super().get_queryset(), self.request.user)
        payroll_run = self.request.query_params.get("payroll_run")
        employee = self.request.query_params.get("employee")
        if payroll_run:
            qs = qs.filter(payroll_run_id=payroll_run)
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs.order_by("-created_at")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_payroll(request):
    from apps.employees.models import Employee
    from apps.benefits.models import BenefitEnrollment, BenefitContribution
    from django.db import transaction

    if not can_manage_payroll(request.user):
        return Response({"detail": "You are not allowed to generate payroll."}, status=403)

    period_start = request.data.get("period_start")
    period_end = request.data.get("period_end")
    branch_id = request.data.get("branch")

    if not period_start or not period_end:
        return Response({"detail": "period_start and period_end are required."}, status=400)

    with transaction.atomic():
        run = PayrollRun.objects.create(
            name=f"Payroll {period_start} to {period_end}",
            period_start=period_start,
            period_end=period_end,
            branch_id=branch_id,
            status="Draft",
        )

        employees = Employee.objects.filter(employment_status="Active")
        if branch_id:
            employees = employees.filter(branch_id=branch_id)
        elif request.user.role == "Manager" and not request.user.is_superuser:
            employees = employees.filter(branch__name=request.user.branch_name)

        total_gross = total_deductions = total_net = Decimal("0")
        tax_bands = list(TaxBand.objects.filter(is_active=True).order_by("min_income"))
        statutory_rates = list(StatutoryRate.objects.filter(is_active=True))
        for emp in employees:
            base_salary = Decimal(emp.gross_salary or 0)
            employee_components = EmployeePayComponent.objects.filter(employee=emp, is_active=True)
            allowances = [component for component in employee_components if component.component.component_type == "Allowance"]
            component_deductions = [component for component in employee_components if component.component.component_type in ("Deduction", "Statutory")]
            allowance_total = sum((Decimal(component.amount) for component in allowances), Decimal("0"))
            gross = base_salary + allowance_total
            payslip = Payslip.objects.create(
                payroll_run=run,
                employee=emp,
                gross_pay=gross,
                total_allowances=allowance_total,
            )
            for component in allowances:
                Allowance.objects.create(payslip=payslip, name=component.component.name, amount=component.amount, is_taxable=component.component.is_taxable)

            deduction_total = Decimal("0")
            for component in component_deductions:
                Deduction.objects.create(payslip=payslip, name=component.component.name, amount=component.amount, deduction_type=component.component.component_type)
                deduction_total += Decimal(component.amount)
            for rate in statutory_rates:
                amount = (gross * Decimal(rate.employee_rate)) if rate.is_percentage else Decimal(rate.employee_rate)
                if amount:
                    Deduction.objects.create(payslip=payslip, name=rate.name, amount=amount, deduction_type="Statutory")
                    deduction_total += amount
            for enrollment in BenefitEnrollment.objects.filter(employee=emp, status="Approved").select_related("plan"):
                amount = Decimal(enrollment.employee_contribution)
                if enrollment.plan.is_percentage:
                    amount = gross * amount / Decimal("100")
                if amount:
                    Deduction.objects.create(payslip=payslip, name=enrollment.plan.name, amount=amount, deduction_type="Benefit")
                    deduction_total += amount
                    BenefitContribution.objects.get_or_create(enrollment=enrollment, employee=emp, period=f"{period_start}:{period_end}", defaults={"employee_amount": amount, "employer_amount": enrollment.employer_contribution})
            tax = Decimal("0")
            for band in tax_bands:
                lower = Decimal(band.min_income)
                upper = min(gross, Decimal(band.max_income)) if band.max_income is not None else gross
                taxable_amount = max(Decimal("0"), upper - lower)
                tax += taxable_amount * Decimal(band.rate)
            if tax:
                Deduction.objects.create(payslip=payslip, name="Income tax", amount=tax, deduction_type="Tax")
            deduction_total += tax
            payslip.total_deductions = deduction_total
            payslip.tax_amount = tax
            payslip.net_pay = gross - deduction_total
            payslip.save(update_fields=["total_deductions", "tax_amount", "net_pay"])
            total_gross += gross
            total_deductions += deduction_total
            total_net += payslip.net_pay

        run.total_gross = total_gross
        run.total_deductions = total_deductions
        run.total_net = total_net
        run.employee_count = employees.count()
        run.save()

    return Response(PayrollRunSerializer(run).data, status=201)
