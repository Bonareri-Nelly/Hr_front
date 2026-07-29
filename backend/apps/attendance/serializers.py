from rest_framework import serializers
from .models import WorkLocation, Shift, AttendanceRecord, LocationLog, CorrectionRequest, EmployeeAttendanceAssignment


class WorkLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkLocation
        fields = "__all__"


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = "__all__"


class AttendanceRecordSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()

    class Meta:
        model = AttendanceRecord
        fields = "__all__"


class LocationLogSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()

    class Meta:
        model = LocationLog
        fields = "__all__"


class CorrectionRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()

    class Meta:
        model = CorrectionRequest
        fields = "__all__"


class EmployeeAttendanceAssignmentSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()

    class Meta:
        model = EmployeeAttendanceAssignment
        fields = "__all__"
