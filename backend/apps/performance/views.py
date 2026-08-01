from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import PerformanceCycle, PerformanceGoal, PerformanceReview, GoalProgress
from .serializers import (
    PerformanceCycleSerializer, PerformanceGoalSerializer,
    PerformanceReviewSerializer, GoalProgressSerializer,
)
from apps.authentication.access import scope_employee_relation, scoped_employee_ids, can_manage_performance


class PerformanceCycleViewSet(viewsets.ModelViewSet):
    queryset = PerformanceCycle.objects.all()
    serializer_class = PerformanceCycleSerializer


class PerformanceGoalViewSet(viewsets.ModelViewSet):
    queryset = PerformanceGoal.objects.select_related("employee", "cycle").all()
    serializer_class = PerformanceGoalSerializer

    def get_queryset(self):
        qs = scope_employee_relation(super().get_queryset(), self.request.user)
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs


class PerformanceReviewViewSet(viewsets.ModelViewSet):
    queryset = PerformanceReview.objects.select_related("employee", "cycle").all()
    serializer_class = PerformanceReviewSerializer

    def get_queryset(self):
        qs = scope_employee_relation(super().get_queryset(), self.request.user)
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs.order_by("-created_at")

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        review = self.get_object()
        review.status = "Submitted"
        review.save()
        return Response(PerformanceReviewSerializer(review).data)

    @action(detail=True, methods=["post"], url_path="manager-approve")
    def manager_approve(self, request, pk=None):
        if not can_manage_performance(request.user):
            raise PermissionDenied("You are not allowed to approve performance reviews.")
        review = self.get_object()
        review.status = "Manager Approved"
        review.manager_comments = request.data.get("comments", review.manager_comments)
        review.save()
        return Response(PerformanceReviewSerializer(review).data)

    @action(detail=True, methods=["post"], url_path="hr-approve")
    def hr_approve(self, request, pk=None):
        if not (request.user.is_superuser or request.user.role in {"System Admin", "HR"}):
            raise PermissionDenied("Only HR can give HR approval.")
        review = self.get_object()
        review.status = "HR Approved"
        review.hr_comments = request.data.get("comments", review.hr_comments)
        review.save()
        return Response(PerformanceReviewSerializer(review).data)

    @action(detail=True, methods=["post"])
    def finalize(self, request, pk=None):
        review = self.get_object()
        review.status = "Finalized"
        review.save()
        return Response(PerformanceReviewSerializer(review).data)


class GoalProgressViewSet(viewsets.ModelViewSet):
    queryset = GoalProgress.objects.select_related("employee", "goal").all()
    serializer_class = GoalProgressSerializer

    def get_queryset(self):
        return scope_employee_relation(super().get_queryset(), self.request.user)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_progress(request):
    serializer = GoalProgressSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    if not scoped_employee_ids(request.user).filter(id=serializer.validated_data["employee"].id).exists():
        return Response({"detail": "You are not allowed to update this employee's progress."}, status=status.HTTP_403_FORBIDDEN)
    prog = serializer.save()
    prog.goal.progress = prog.progress_percent
    prog.goal.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def employee_goals(request, employee_id):
    if not scoped_employee_ids(request.user).filter(id=employee_id).exists():
        return Response({"detail": "You are not allowed to view these goals."}, status=status.HTTP_403_FORBIDDEN)
    goals = PerformanceGoal.objects.filter(employee_id=employee_id).select_related("cycle")
    return Response(PerformanceGoalSerializer(goals, many=True).data)
