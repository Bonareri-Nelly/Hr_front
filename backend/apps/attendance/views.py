from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import WorkLocation, Shift, AttendanceRecord, LocationLog, CorrectionRequest, EmployeeAttendanceAssignment
from .serializers import (
    WorkLocationSerializer, ShiftSerializer, AttendanceRecordSerializer,
    LocationLogSerializer, CorrectionRequestSerializer, EmployeeAttendanceAssignmentSerializer,
)


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
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
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
    employee_id = request.data.get("employee_id") or getattr(request.user, "employee_id", None)
    if not employee_id:
        return Response({"detail": "employee_id required."}, status=400)
    try:
        employee = Employee.objects.get(id=employee_id)
    except Employee.DoesNotExist:
        return Response({"detail": "Employee not found."}, status=404)

    today = timezone.now().date()
    record, _ = AttendanceRecord.objects.get_or_create(employee=employee, date=today)
    if record.check_in:
        return Response({"detail": "Already checked in today."}, status=400)
    record.check_in = timezone.now()
    record.status = "Present"
    record.save()
    return Response(AttendanceRecordSerializer(record).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def check_out_view(request):
    from apps.employees.models import Employee
    employee_id = request.data.get("employee_id") or getattr(request.user, "employee_id", None)
    if not employee_id:
        return Response({"detail": "employee_id required."}, status=400)
    try:
        employee = Employee.objects.get(id=employee_id)
    except Employee.DoesNotExist:
        return Response({"detail": "Employee not found."}, status=404)

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
    return Response(AttendanceRecordSerializer(record).data)
