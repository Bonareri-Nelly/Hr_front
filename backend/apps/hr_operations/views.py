from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .models import (
    HrPerformanceReview, HrPerformanceGoal, DisciplinaryCase,
    Announcement, Training, TrainingEnrollment,
)
from .serializers import (
    HrPerformanceReviewSerializer, HrPerformanceGoalSerializer,
    DisciplinaryCaseSerializer, AnnouncementSerializer,
    TrainingSerializer, TrainingEnrollmentSerializer,
)


class HrPerformanceReviewViewSet(viewsets.ModelViewSet):
    queryset = HrPerformanceReview.objects.select_related("employee").all()
    serializer_class = HrPerformanceReviewSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        review = self.get_object()
        review.status = "Submitted"
        review.save()
        return Response(HrPerformanceReviewSerializer(review).data)


class HrPerformanceGoalViewSet(viewsets.ModelViewSet):
    queryset = HrPerformanceGoal.objects.select_related("employee").all()
    serializer_class = HrPerformanceGoalSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs


class DisciplinaryCaseViewSet(viewsets.ModelViewSet):
    queryset = DisciplinaryCase.objects.select_related("employee").all()
    serializer_class = DisciplinaryCaseSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs.order_by("-created_at")

    @action(detail=True, methods=["post"])
    def resolve(self, request, pk=None):
        case = self.get_object()
        case.status = "Resolved"
        case.resolution_notes = request.data.get("resolution_notes", "")
        case.resolved_at = timezone.now()
        case.save()
        return Response(DisciplinaryCaseSerializer(case).data)


class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer

    def get_queryset(self):
        return super().get_queryset().order_by("-created_at")

    @action(detail=False, methods=["get"])
    def active(self, request):
        now = timezone.now()
        announcements = Announcement.objects.filter(
            is_active=True,
        ).filter(
            Q(expires_at__isnull=True) | Q(expires_at__gte=now)
        ).order_by("-created_at")
        return Response(AnnouncementSerializer(announcements, many=True).data)


class TrainingViewSet(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer

    def get_queryset(self):
        return super().get_queryset().order_by("-created_at")

    @action(detail=True, methods=["post"])
    def enroll(self, request, pk=None):
        training = self.get_object()
        employee_id = request.data.get("employee_id")
        if not employee_id:
            return Response({"detail": "employee_id required."}, status=400)
        enrollment, created = TrainingEnrollment.objects.get_or_create(
            training=training, employee_id=employee_id,
            defaults={"status": "Enrolled"},
        )
        return Response(
            TrainingEnrollmentSerializer(enrollment).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class TrainingEnrollmentViewSet(viewsets.ModelViewSet):
    queryset = TrainingEnrollment.objects.select_related("training", "employee").all()
    serializer_class = TrainingEnrollmentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs

