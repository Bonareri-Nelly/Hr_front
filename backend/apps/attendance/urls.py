from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    WorkLocationViewSet, ShiftViewSet, AttendanceRecordViewSet,
    LocationLogViewSet, CorrectionRequestViewSet, EmployeeAttendanceAssignmentViewSet,
    check_in_view, check_out_view,
)

router = DefaultRouter(trailing_slash=True)
router.register("attendance/work-locations", WorkLocationViewSet, basename="work-location")
router.register("attendance/shifts", ShiftViewSet, basename="shift")
router.register("attendance/records", AttendanceRecordViewSet, basename="attendance-record")
router.register("attendance/location-logs", LocationLogViewSet, basename="location-log")
router.register("attendance/correction-requests", CorrectionRequestViewSet, basename="correction-request")
router.register("attendance/employee-attendance-assignments", EmployeeAttendanceAssignmentViewSet, basename="attendance-assignment")

urlpatterns = router.urls + [
    path("attendance/check-in/", check_in_view),
    path("attendance/check-out/", check_out_view),
]
