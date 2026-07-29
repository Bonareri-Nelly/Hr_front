from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    PerformanceCycleViewSet, PerformanceGoalViewSet,
    PerformanceReviewViewSet, GoalProgressViewSet,
    submit_progress, employee_goals,
)

router = DefaultRouter(trailing_slash=True)
router.register("performance/cycles", PerformanceCycleViewSet, basename="performance-cycle")
router.register("performance/goals", PerformanceGoalViewSet, basename="performance-goal")
router.register("performance/reviews", PerformanceReviewViewSet, basename="performance-review")
router.register("performance/progress", GoalProgressViewSet, basename="goal-progress")

urlpatterns = router.urls + [
    path("performance/submit-progress/", submit_progress),
    path("performance/employees/<int:employee_id>/goals/", employee_goals),
]
