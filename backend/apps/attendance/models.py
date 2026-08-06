from django.db import models
from apps.employees.models import Employee


class WorkLocation(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField(blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    radius_meters = models.PositiveIntegerField(default=200)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Shift(models.Model):
    name = models.CharField(max_length=100)
    start_time = models.TimeField()
    end_time = models.TimeField()
    break_minutes = models.PositiveIntegerField(default=60)
    is_night_shift = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class AttendanceRecord(models.Model):
    STATUS_CHOICES = [
        ("Present", "Present"), ("Absent", "Absent"),
        ("Late", "Late"), ("Half Day", "Half Day"), ("On Leave", "On Leave"),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="attendance_records")
    contract = models.ForeignKey("contracts.Contract", on_delete=models.SET_NULL, null=True, blank=True, related_name="attendance_records")
    date = models.DateField()
    check_in = models.DateTimeField(null=True, blank=True)
    check_out = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Present")
    work_location = models.ForeignKey(WorkLocation, on_delete=models.SET_NULL, null=True, blank=True)
    shift = models.ForeignKey(Shift, on_delete=models.SET_NULL, null=True, blank=True)
    hours_worked = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    overtime_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [["employee", "date"]]

    @property
    def employee_name(self):
        return self.employee.full_name


class LocationLog(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="location_logs")
    timestamp = models.DateTimeField(auto_now_add=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    accuracy = models.FloatField(null=True, blank=True)
    work_location = models.ForeignKey(WorkLocation, on_delete=models.SET_NULL, null=True, blank=True)

    @property
    def employee_name(self):
        return self.employee.full_name


class CorrectionRequest(models.Model):
    STATUS_CHOICES = [("Pending", "Pending"), ("Approved", "Approved"), ("Rejected", "Rejected")]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="correction_requests")
    attendance_record = models.ForeignKey(AttendanceRecord, on_delete=models.CASCADE, null=True, blank=True)
    date = models.DateField()
    requested_check_in = models.DateTimeField(null=True, blank=True)
    requested_check_out = models.DateTimeField(null=True, blank=True)
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    reviewed_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="reviewed_corrections")
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def employee_name(self):
        return self.employee.full_name


class EmployeeAttendanceAssignment(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="attendance_assignments")
    shift = models.ForeignKey(Shift, on_delete=models.SET_NULL, null=True, blank=True)
    work_location = models.ForeignKey(WorkLocation, on_delete=models.SET_NULL, null=True, blank=True)
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def employee_name(self):
        return self.employee.full_name
