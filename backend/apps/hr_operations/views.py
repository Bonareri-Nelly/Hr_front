from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
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
    RecruitmentApplicationSerializer,
    ComplaintSerializer,
)
from .models import RecruitmentApplication, Complaint
from apps.authentication.access import scope_employee_relation, scoped_employee_ids, can_manage_performance


class HrPerformanceReviewViewSet(viewsets.ModelViewSet):
    queryset = HrPerformanceReview.objects.select_related("employee").all()
    serializer_class = HrPerformanceReviewSerializer

    def get_queryset(self):
        qs = scope_employee_relation(super().get_queryset(), self.request.user)
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
        qs = scope_employee_relation(super().get_queryset(), self.request.user)
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs


class DisciplinaryCaseViewSet(viewsets.ModelViewSet):
    queryset = DisciplinaryCase.objects.select_related("employee").all()
    serializer_class = DisciplinaryCaseSerializer

    def get_queryset(self):
        qs = scope_employee_relation(super().get_queryset(), self.request.user)
        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs.order_by("-created_at")

    @action(detail=True, methods=["post"])
    def notify(self, request, pk=None):
        case = self.get_object()
        return Response({"message": f"Notification queued for {case.employee_name}.", "employee": case.employee_id})

    @action(detail=True, methods=["post"])
    def resolve(self, request, pk=None):
        if not can_manage_performance(request.user):
            raise PermissionDenied("You are not allowed to resolve disciplinary cases.")
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
        user = self.request.user
        qs = super().get_queryset()
        if user.is_superuser or user.role in {"System Admin", "Executive"}:
            return qs.order_by("-created_at")

        audience = {
            "Manager": "Managers",
            "Department Head": "Department Heads",
        }.get(user.role, user.role)
        recipient_filter = Q(target_audience="All") | Q(target_audience=audience)
        if user.employee_id:
            recipient_filter |= Q(target_employee_id=user.employee_id)
            from apps.employees.models import Employee
            branch_id = Employee.objects.filter(id=user.employee_id).values_list("branch_id", flat=True).first()
            if branch_id:
                recipient_filter |= Q(target_branch_id=branch_id)
        elif user.branch_name:
            recipient_filter |= Q(target_branch__name=user.branch_name)
        return qs.filter(recipient_filter | Q(author_id=user.employee_id)).order_by("-created_at")

    def perform_create(self, serializer):
        if not (self.request.user.is_superuser or self.request.user.role in {"System Admin", "Executive", "HR", "Manager"}):
            raise PermissionDenied("You are not allowed to publish announcements.")
        serializer.save(author_id=self.request.user.employee_id)

    @action(detail=False, methods=["get"])
    def active(self, request):
        now = timezone.now()
        announcements = self.get_queryset().filter(
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
        employee_id = request.user.employee_id
        if not employee_id:
            return Response({"detail": "Your account is not linked to an employee profile."}, status=400)
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
        qs = scope_employee_relation(super().get_queryset(), self.request.user)
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs


class RecruitmentApplicationViewSet(viewsets.ModelViewSet):
    queryset = RecruitmentApplication.objects.all().order_by("-submitted_at")
    serializer_class = RecruitmentApplicationSerializer

    def get_permissions(self):
        # A public application is the only anonymous action; review remains authenticated.
        return [AllowAny()] if self.action == "create" else [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role in {"System Admin", "HR", "Executive"}:
            return super().get_queryset()
        if user.role == "Manager":
            return super().get_queryset().filter(branch=user.branch_name)
        return super().get_queryset().none()

    @action(detail=True, methods=["post"])
    def decide(self, request, pk=None):
        if not (request.user.is_superuser or request.user.role in {"System Admin", "HR"}):
            raise PermissionDenied("Only HR can decide candidate applications.")
        application = self.get_object()
        stage = request.data.get("stage")
        if stage not in dict(RecruitmentApplication.STAGES):
            return Response({"detail": "Invalid application stage."}, status=status.HTTP_400_BAD_REQUEST)
        application.stage = stage
        application.decision_note = request.data.get("decision_note", "")
        application.save(update_fields=["stage", "decision_note", "updated_at"])
        return Response(self.get_serializer(application).data)


class ComplaintViewSet(viewsets.ModelViewSet):
    serializer_class = ComplaintSerializer
    queryset = Complaint.objects.select_related("employee", "reviewed_by").all()

    def get_queryset(self):
        if self.request.user.role == "Finance" and not self.request.user.is_superuser:
            return super().get_queryset().filter(category="Compensation payroll dispute").order_by("-created_at")
        return scope_employee_relation(super().get_queryset(), self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        if not self.request.user.employee_id:
            raise PermissionDenied("Your account is not linked to an employee profile.")
        serializer.save(employee_id=self.request.user.employee_id)

    @action(detail=True, methods=["post"])
    def resolve(self, request, pk=None):
        if not (request.user.is_superuser or request.user.role in {"System Admin", "HR", "Finance"}):
            raise PermissionDenied("You are not allowed to resolve complaints.")
        complaint = self.get_object()
        complaint.status = request.data.get("status", "Resolved")
        complaint.resolution_notes = request.data.get("resolution_notes", "")
        complaint.reviewed_by_id = request.user.employee_id
        complaint.save(update_fields=["status", "resolution_notes", "reviewed_by", "updated_at"])
        return Response(self.get_serializer(complaint).data)

