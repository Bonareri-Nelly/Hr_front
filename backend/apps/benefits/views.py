from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import BenefitPlan, BenefitWindow, BenefitEnrollment, BenefitContribution
from .serializers import (
    BenefitPlanSerializer, BenefitWindowSerializer,
    BenefitEnrollmentSerializer, BenefitContributionSerializer,
)


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
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        enrollment = self.get_object()
        enrollment.status = "Approved"
        enrollment.save()
        return Response(BenefitEnrollmentSerializer(enrollment).data)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        enrollment = self.get_object()
        enrollment.status = "Rejected"
        enrollment.save()
        return Response(BenefitEnrollmentSerializer(enrollment).data)


class BenefitContributionViewSet(viewsets.ModelViewSet):
    queryset = BenefitContribution.objects.select_related("employee").all()
    serializer_class = BenefitContributionSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def enroll_benefit(request):
    serializer = BenefitEnrollmentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def employee_benefits(request, employee_id):
    enrollments = BenefitEnrollment.objects.filter(employee_id=employee_id).select_related("plan")
    return Response(BenefitEnrollmentSerializer(enrollments, many=True).data)
