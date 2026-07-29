from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    LeaveTypeViewSet, LeaveBalanceViewSet, LeaveRequestViewSet,
    LeaveApprovalViewSet, LeaveAttachmentViewSet, PublicHolidayViewSet,
    create_leave_request,
)

router = DefaultRouter(trailing_slash=True)
router.register("leave/types", LeaveTypeViewSet, basename="leave-type")
router.register("leave/balances", LeaveBalanceViewSet, basename="leave-balance")
router.register("leave/requests", LeaveRequestViewSet, basename="leave-request")
router.register("leave/approvals", LeaveApprovalViewSet, basename="leave-approval")
router.register("leave/attachments", LeaveAttachmentViewSet, basename="leave-attachment")
router.register("leave/public-holidays", PublicHolidayViewSet, basename="public-holiday")

urlpatterns = router.urls + [
    path("leave/requests/create/", create_leave_request),
]
