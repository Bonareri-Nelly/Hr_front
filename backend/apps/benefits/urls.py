from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    BenefitPlanViewSet, BenefitWindowViewSet, BenefitEnrollmentViewSet,
    BenefitContributionViewSet, enroll_benefit, employee_benefits,
    benefit_types, benefits_overview, benefits_export,
)

router = DefaultRouter(trailing_slash=True)
router.register("benefits/plans", BenefitPlanViewSet, basename="benefit-plan")
router.register("benefits/enrollments", BenefitEnrollmentViewSet, basename="benefit-enrollment")
router.register("benefits/windows", BenefitWindowViewSet, basename="benefit-window")
router.register("benefits/contributions", BenefitContributionViewSet, basename="benefit-contribution")

urlpatterns = router.urls + [
    path("benefits/enroll/", enroll_benefit),
    path("benefits/employees/<int:employee_id>/benefits/", employee_benefits),
    path("benefits/types", benefit_types),
    path("benefits/overview", benefits_overview),
    path("benefits/export", benefits_export),
]
