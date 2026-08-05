import csv
import io
from decimal import Decimal

from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import BenefitPlan, BenefitWindow, BenefitEnrollment, BenefitContribution
from .serializers import (
    BenefitPlanSerializer, BenefitWindowSerializer,
    BenefitEnrollmentSerializer, BenefitContributionSerializer,
)
from apps.authentication.access import scope_employee_relation, scoped_employee_ids, can_manage_benefits


class BenefitPlanViewSet(viewsets.ModelViewSet):
    queryset = BenefitPlan.objects.all()
    serializer_class = BenefitPlanSerializer


class BenefitWindowViewSet(viewsets.ModelViewSet):
    queryset = BenefitWindow.objects.all()
    serializer_class = BenefitWindowSerializer


class BenefitEnrollmentViewSet(viewsets.ModelViewSet):
    queryset = BenefitEnrollment.objects.select_related("employee", "plan").all()
    serializer_class = BenefitEnrollmentSerializer

    def get_queryset(self):
        qs = scope_employee_relation(super().get_queryset(), self.request.user)
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs

    def perform_create(self, serializer):
        employee_id = serializer.validated_data["employee"].id
        if str(employee_id) != str(self.request.user.employee_id) and not can_manage_benefits(self.request.user):
            raise PermissionDenied("You can only enroll yourself in benefits.")
        plan = serializer.validated_data["plan"]
        serializer.save(
            employee_contribution=plan.employee_contribution,
            employer_contribution=plan.employer_contribution,
        )

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        if not can_manage_benefits(request.user):
            raise PermissionDenied("You are not allowed to approve benefit enrolments.")
        enrollment = self.get_object()
        enrollment.status = "Approved"
        enrollment.save()
        return Response(BenefitEnrollmentSerializer(enrollment).data)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        if not can_manage_benefits(request.user):
            raise PermissionDenied("You are not allowed to reject benefit enrolments.")
        enrollment = self.get_object()
        enrollment.status = "Rejected"
        enrollment.save()
        return Response(BenefitEnrollmentSerializer(enrollment).data)


class BenefitContributionViewSet(viewsets.ModelViewSet):
    queryset = BenefitContribution.objects.select_related("employee").all()
    serializer_class = BenefitContributionSerializer

    def get_queryset(self):
        return scope_employee_relation(super().get_queryset(), self.request.user)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def benefit_types(request):
    plans = BenefitPlan.objects.filter(is_active=True)
    payload = [
        {
            "id": str(plan.id),
            "name": plan.name,
            "category": plan.plan_type,
            "description": plan.description,
            "employerCoveredPercentage": float(plan.employer_contribution),
            "employeeCoveredPercentage": float(plan.employee_contribution),
            "eligibilityRule": {
                "type": "org-wide",
                "criteria": [],
            },
            "active": plan.is_active,
            "createdAt": plan.created_at.isoformat(),
            "updatedAt": plan.created_at.isoformat(),
        }
        for plan in plans
    ]
    return Response(payload)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def benefits_overview(request):
    from apps.employees.models import Employee

    branch_id = request.data.get("branchId")
    employees = Employee.objects.filter(employment_status="Active").select_related("branch")
    if branch_id:
        employees = employees.filter(branch_id=branch_id)

    total_eligible = employees.count()
    enrollments = BenefitEnrollment.objects.filter(employee__in=employees, status__in=["Pending", "Approved"]).select_related("plan", "employee")
    total_enrolled = enrollments.count()

    by_category = {}
    by_branch = {}
    total_employee_cost = 0.0
    total_employer_cost = 0.0

    for enrollment in enrollments:
        plan = enrollment.plan
        branch = enrollment.employee.branch
        category = plan.plan_type
        branch_id_value = str(branch.id) if branch else "unknown"
        branch_name = branch.name if branch else "Unknown"
        employee_cost = float(enrollment.employee_contribution)
        employer_cost = float(enrollment.employer_contribution)
        total_employee_cost += employee_cost
        total_employer_cost += employer_cost

        by_category.setdefault(category, {"category": category, "eligible": 0, "enrolled": 0, "rate": 0, "cost": 0, "costPerEmployee": 0, "trend": 0})
        by_category[category]["enrolled"] += 1
        by_category[category]["cost"] += employee_cost + employer_cost

        by_branch.setdefault(branch_id_value, {"branchId": branch_id_value, "branchName": branch_name, "eligible": 0, "enrolled": 0, "rate": 0, "cost": 0, "costPerEmployee": 0})
        by_branch[branch_id_value]["enrolled"] += 1
        by_branch[branch_id_value]["cost"] += employee_cost + employer_cost

    for category_stats in by_category.values():
        category_stats["eligible"] = total_eligible
        category_stats["rate"] = round((category_stats["enrolled"] / total_eligible * 100) if total_eligible else 0, 2)
        category_stats["costPerEmployee"] = round(category_stats["cost"] / category_stats["enrolled"] if category_stats["enrolled"] else 0, 2)

    for branch_stats in by_branch.values():
        branch_stats["eligible"] = total_eligible
        branch_stats["rate"] = round((branch_stats["enrolled"] / total_eligible * 100) if total_eligible else 0, 2)
        branch_stats["costPerEmployee"] = round(branch_stats["cost"] / branch_stats["enrolled"] if branch_stats["enrolled"] else 0, 2)

    summary = {
        "totalEligible": total_eligible,
        "totalEnrolled": total_enrolled,
        "enrollmentRate": round((total_enrolled / total_eligible * 100) if total_eligible else 0, 2),
        "enrollmentTrend": {
            "totalEmployees": total_eligible,
            "enrolled": total_enrolled,
        },
        "costTrend": {
            "percentage": 0,
            "direction": "stable",
        },
        "byCategory": list(by_category.values()),
        "byBranch": list(by_branch.values()),
        "costSummary": {
            "total": round(total_employee_cost + total_employer_cost, 2),
            "employerCovered": round(total_employer_cost, 2),
            "employeeCovered": round(total_employee_cost, 2),
            "costPerEmployee": round(((total_employee_cost + total_employer_cost) / total_eligible) if total_eligible else 0, 2),
            "budget": 0,
            "actual": round(total_employee_cost + total_employer_cost, 2),
            "variance": 0,
        },
        "trends": [
            {"date": "2024-01", "enrolled": total_enrolled, "eligible": total_eligible, "cost": round(total_employee_cost + total_employer_cost, 2), "costPerEmployee": round(((total_employee_cost + total_employer_cost) / total_eligible) if total_eligible else 0, 2), "newEnrollments": total_enrolled, "cancellations": 0, "budget": 0},
        ],
        "alerts": [],
        "categories": list(by_category.keys()),
        "branches": [
            {"id": item["branchId"], "name": item["branchName"], "code": "", "location": "", "managerId": ""}
            for item in by_branch.values()
        ],
    }
    return Response(summary)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def benefits_export(request):
    from apps.employees.models import Employee

    report_type = request.data.get("type", "enrollments")
    export_format = request.data.get("format", "csv")
    branch_id = request.data.get("branchId")

    enrollments = BenefitEnrollment.objects.filter(status__in=["Pending", "Approved"]).select_related("plan", "employee")
    if branch_id:
        enrollments = enrollments.filter(employee__branch_id=branch_id)

    if export_format == "csv":
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(["Enrollment ID", "Employee", "Benefit", "Status", "Employee Contribution", "Employer Contribution", "Enrolled At"])
        for enrollment in enrollments:
            writer.writerow([
                enrollment.id,
                enrollment.employee.full_name,
                enrollment.plan.name,
                enrollment.status,
                float(enrollment.employee_contribution),
                float(enrollment.employer_contribution),
                enrollment.enrolled_at.isoformat(),
            ])
        body = buffer.getvalue()
        response = HttpResponse(body, content_type="text/csv")
        response["Content-Disposition"] = "attachment; filename=benefits_export.csv"
        return response

    return Response({"message": "Export format not supported."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def enroll_benefit(request):
    data = request.data.copy()
    if not request.user.employee_id:
        return Response({"detail": "Your account is not linked to an employee profile."}, status=status.HTTP_400_BAD_REQUEST)
    data["employee"] = request.user.employee_id
    try:
        plan = BenefitPlan.objects.get(pk=data.get("plan"), is_active=True)
    except BenefitPlan.DoesNotExist:
        return Response({"detail": "An active benefit plan is required."}, status=status.HTTP_400_BAD_REQUEST)
    data["employee_contribution"] = plan.employee_contribution
    data["employer_contribution"] = plan.employer_contribution
    serializer = BenefitEnrollmentSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def employee_benefits(request, employee_id):
    if not scoped_employee_ids(request.user).filter(id=employee_id).exists():
        return Response({"detail": "You can only view your own benefit enrolments."}, status=status.HTTP_403_FORBIDDEN)
    enrollments = BenefitEnrollment.objects.filter(employee_id=employee_id).select_related("plan")
    return Response(BenefitEnrollmentSerializer(enrollments, many=True).data)
