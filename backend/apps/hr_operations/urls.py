from rest_framework.routers import DefaultRouter
from .views import (
    HrPerformanceReviewViewSet, HrPerformanceGoalViewSet, DisciplinaryCaseViewSet,
    AnnouncementViewSet, TrainingViewSet, TrainingEnrollmentViewSet,
)

router = DefaultRouter(trailing_slash=True)
router.register("hr-operations/performance-reviews", HrPerformanceReviewViewSet, basename="hr-perf-review")
router.register("hr-operations/performance-goals", HrPerformanceGoalViewSet, basename="hr-perf-goal")
router.register("hr-operations/disciplinary-cases", DisciplinaryCaseViewSet, basename="disciplinary-case")
router.register("hr-operations/announcements", AnnouncementViewSet, basename="announcement")
router.register("hr-operations/trainings", TrainingViewSet, basename="training")
router.register("hr-operations/training-enrollments", TrainingEnrollmentViewSet, basename="training-enrollment")

urlpatterns = router.urls
