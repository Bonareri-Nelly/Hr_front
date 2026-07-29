from rest_framework.routers import DefaultRouter
from .views import (
    BranchViewSet, DepartmentViewSet, DesignationViewSet, EmployeeViewSet,
    DocumentViewSet, EducationViewSet, WorkExperienceViewSet, DependantViewSet,
    CertificationViewSet, SkillViewSet, BankAccountViewSet, AssetViewSet,
)

router = DefaultRouter(trailing_slash=True)
router.register("branches", BranchViewSet, basename="branch")
router.register("departments", DepartmentViewSet, basename="department")
router.register("designations", DesignationViewSet, basename="designation")
router.register("employees", EmployeeViewSet, basename="employee")
router.register("documents", DocumentViewSet, basename="document")
router.register("education", EducationViewSet, basename="education")
router.register("work-experience", WorkExperienceViewSet, basename="work-experience")
router.register("dependants", DependantViewSet, basename="dependant")
router.register("certifications", CertificationViewSet, basename="certification")
router.register("skills", SkillViewSet, basename="skill")
router.register("bank-accounts", BankAccountViewSet, basename="bank-account")
router.register("assets", AssetViewSet, basename="asset")

urlpatterns = router.urls
