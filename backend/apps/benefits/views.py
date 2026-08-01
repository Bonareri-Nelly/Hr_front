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
