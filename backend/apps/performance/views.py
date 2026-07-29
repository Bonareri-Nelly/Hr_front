from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import PerformanceCycle, PerformanceGoal, PerformanceReview, GoalProgress
from .serializers import (
    PerformanceCycleSerializer, PerformanceGoalSerializer,
    PerformanceReviewSerializer, GoalProgressSerializer,
)


class PerformanceCycleViewSet(viewsets.ModelViewSet):
    queryset = PerformanceCycle.objects.all()
    serializer_class = PerformanceCycleSerializer


class PerformanceGoalViewSet(viewsets.ModelViewSet):
    queryset = PerformanceGoal.objects.select_related("employee", "cycle").all()
    serializer_class = PerformanceGoalSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs


class PerformanceReviewViewSet(viewsets.ModelViewSet):
    queryset = PerformanceReview.objects.select_related("employee", "cycle").all()
    serializer_class = PerformanceReviewSerializer

    def get_queryset(self):
        qs = super().get_queryset()
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
        review = self.get_object()
        review.status = "Manager Approved"
        review.manager_comments = request.data.get("comments", review.manager_comments)
        review.save()
        return Response(PerformanceReviewSerializer(review).data)

    @action(detail=True, methods=["post"], url_path="hr-approve")
    def hr_approve(self, request, pk=None):
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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_progress(request):
    serializer = GoalProgressSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    prog = serializer.save()
    prog.goal.progress = prog.progress_percent
    prog.goal.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def employee_goals(request, employee_id):
    goals = PerformanceGoal.objects.filter(employee_id=employee_id).select_related("cycle")
    return Response(PerformanceGoalSerializer(goals, many=True).data)
