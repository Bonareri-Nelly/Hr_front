from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.db import models
from math import atan2, cos, radians, sin, sqrt
from .models import WorkLocation, Shift, AttendanceRecord, LocationLog, CorrectionRequest, EmployeeAttendanceAssignment
from .serializers import (
    WorkLocationSerializer, ShiftSerializer, AttendanceRecordSerializer,
    LocationLogSerializer, CorrectionRequestSerializer, EmployeeAttendanceAssignmentSerializer,
)
from apps.authentication.access import scope_employee_relation


class WorkLocationViewSet(viewsets.ModelViewSet):
    queryset = WorkLocation.objects.all()
    serializer_class = WorkLocationSerializer


class ShiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.select_related("employee").all()
    serializer_class = AttendanceRecordSerializer

    def get_queryset(self):
        qs = scope_employee_relation(super().get_queryset(), self.request.user)
        employee = self.request.query_params.get("employee")
        # The base queryset is already role-scoped, so this remains safe for
        # HR, branch managers and department heads as well as self-service users.
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs.order_by("-date")


class LocationLogViewSet(viewsets.ModelViewSet):
    queryset = LocationLog.objects.select_related("employee").all()
    serializer_class = LocationLogSerializer


class CorrectionRequestViewSet(viewsets.ModelViewSet):
    queryset = CorrectionRequest.objects.select_related("employee").all()
    serializer_class = CorrectionRequestSerializer


class EmployeeAttendanceAssignmentViewSet(viewsets.ModelViewSet):
    queryset = EmployeeAttendanceAssignment.objects.select_related("employee").all()
    serializer_class = EmployeeAttendanceAssignmentSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def check_in_view(request):
    from apps.employees.models import Employee
    # Never let a self-service user clock in on behalf of someone else.
    employee_id = getattr(request.user, "employee_id", None)
    if not employee_id:
        return Response({"detail": "employee_id required."}, status=400)
    try:
        employee = Employee.objects.get(id=employee_id)
    except Employee.DoesNotExist:
        return Response({"detail": "Employee not found."}, status=404)

    assignment = EmployeeAttendanceAssignment.objects.filter(
        employee=employee, is_active=True, effective_from__lte=timezone.now().date()
    ).filter(models.Q(effective_to__isnull=True) | models.Q(effective_to__gte=timezone.now().date())).select_related("work_location").order_by("-effective_from").first()
    location = assignment.work_location if assignment else None
    try:
        latitude, longitude = float(request.data["latitude"]), float(request.data["longitude"])
    except (KeyError, TypeError, ValueError):
        return Response({"detail": "A valid GPS location is required for check-in."}, status=400)
    if location and location.latitude is not None and location.longitude is not None:
        # Haversine distance keeps validation on the server rather than trusting the browser.
        earth_radius = 6371000
        lat_delta, lon_delta = radians(location.latitude - latitude), radians(location.longitude - longitude)
        distance = 2 * earth_radius * atan2(sqrt(sin(lat_delta / 2) ** 2 + cos(radians(latitude)) * cos(radians(location.latitude)) * sin(lon_delta / 2) ** 2), sqrt(1 - (sin(lat_delta / 2) ** 2 + cos(radians(latitude)) * cos(radians(location.latitude)) * sin(lon_delta / 2) ** 2)))
        if distance > location.radius_meters:
            return Response({"detail": f"You are outside the {location.name} attendance area."}, status=400)
    today = timezone.now().date()
    record, _ = AttendanceRecord.objects.get_or_create(employee=employee, date=today)
    if record.check_in:
        return Response({"detail": "Already checked in today."}, status=400)
    record.check_in = timezone.now()
    record.work_location = location
    record.status = "Present"
    record.save()
    LocationLog.objects.create(employee=employee, latitude=latitude, longitude=longitude, accuracy=request.data.get("accuracy"), work_location=location)
    return Response(AttendanceRecordSerializer(record).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def check_out_view(request):
    from apps.employees.models import Employee
    employee_id = getattr(request.user, "employee_id", None)
    if not employee_id:
        return Response({"detail": "employee_id required."}, status=400)
    try:
        employee = Employee.objects.get(id=employee_id)
    except Employee.DoesNotExist:
        return Response({"detail": "Employee not found."}, status=404)

    try:
        latitude, longitude = float(request.data["latitude"]), float(request.data["longitude"])
    except (KeyError, TypeError, ValueError):
        return Response({"detail": "A valid GPS location is required for check-out."}, status=400)
    today = timezone.now().date()
    try:
        record = AttendanceRecord.objects.get(employee=employee, date=today)
    except AttendanceRecord.DoesNotExist:
        return Response({"detail": "No check-in record found for today."}, status=404)
    if record.check_out:
        return Response({"detail": "Already checked out today."}, status=400)
    record.check_out = timezone.now()
    if record.check_in:
        delta = record.check_out - record.check_in
        record.hours_worked = round(delta.total_seconds() / 3600, 2)
    record.save()
    LocationLog.objects.create(employee=employee, latitude=latitude, longitude=longitude, accuracy=request.data.get("accuracy"), work_location=record.work_location)
    return Response(AttendanceRecordSerializer(record).data)
