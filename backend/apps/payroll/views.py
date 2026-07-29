from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import HttpResponse
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


class PayrollPolicyViewSet(viewsets.ModelViewSet):
    queryset = PayrollPolicy.objects.all()
    serializer_class = PayrollPolicySerializer


class TaxBandViewSet(viewsets.ModelViewSet):
    queryset = TaxBand.objects.all()
    serializer_class = TaxBandSerializer


class StatutoryRateViewSet(viewsets.ModelViewSet):
    queryset = StatutoryRate.objects.all()
    serializer_class = StatutoryRateSerializer


class PayComponentViewSet(viewsets.ModelViewSet):
    queryset = PayComponent.objects.all()
    serializer_class = PayComponentSerializer


class EmployeePayComponentViewSet(viewsets.ModelViewSet):
    queryset = EmployeePayComponent.objects.select_related("employee", "component").all()
    serializer_class = EmployeePayComponentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs


class PayrollRunViewSet(viewsets.ModelViewSet):
    queryset = PayrollRun.objects.select_related("branch").all()
    serializer_class = PayrollRunSerializer

    def get_queryset(self):
        return super().get_queryset().order_by("-created_at")

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        run = self.get_object()
        run.status = "Submitted"
        run.save()
        return Response(PayrollRunSerializer(run).data)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        run = self.get_object()
        run.status = "Approved"
        run.save()
        return Response(PayrollRunSerializer(run).data)

    @action(detail=True, methods=["post"])
    def finalize(self, request, pk=None):
        run = self.get_object()
        run.status = "Finalized"
        run.save()
        return Response(PayrollRunSerializer(run).data)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        run = self.get_object()
        run.status = "Cancelled"
        run.save()
        return Response(PayrollRunSerializer(run).data)


class PayslipViewSet(viewsets.ModelViewSet):
    queryset = Payslip.objects.select_related("employee", "payroll_run").all()
    serializer_class = PayslipSerializer

    def get_queryset(self):
        qs = super().get_queryset()
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
    queryset = BankPayment.objects.select_related("employee").all()
    serializer_class = BankPaymentSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_payroll(request):
    from apps.employees.models import Employee, Branch
    from django.db import transaction

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

        total_gross = 0
        for emp in employees:
            gross = float(emp.gross_salary or 0)
            deductions = gross * 0.3
            net = gross - deductions
            Payslip.objects.create(
                payroll_run=run,
                employee=emp,
                gross_pay=gross,
                total_deductions=deductions,
                tax_amount=gross * 0.15,
                net_pay=net,
            )
            total_gross += gross

        run.total_gross = total_gross
        run.total_deductions = total_gross * 0.3
        run.total_net = total_gross * 0.7
        run.employee_count = employees.count()
        run.save()

    return Response(PayrollRunSerializer(run).data, status=201)
