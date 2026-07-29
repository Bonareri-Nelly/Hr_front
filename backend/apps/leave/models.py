from django.db import models
from apps.employees.models import Employee


class LeaveType(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    max_days_per_year = models.PositiveIntegerField(default=21)
    is_paid = models.BooleanField(default=True)
    carry_over = models.BooleanField(default=False)
    requires_attachment = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class LeaveBalance(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="leave_balances")
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE, related_name="balances")
    year = models.PositiveIntegerField()
    entitled_days = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    taken_days = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    pending_days = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    remaining_days = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [["employee", "leave_type", "year"]]

    @property
    def employee_name(self):
        return self.employee.full_name

    @property
    def leave_type_name(self):
        return self.leave_type.name


STATUS_CHOICES = [
    ("Draft", "Draft"), ("Pending", "Pending"),
    ("Manager Approved", "Manager Approved"), ("HR Approved", "HR Approved"),
    ("Approved", "Approved"), ("Rejected", "Rejected"), ("Cancelled", "Cancelled"),
]


class LeaveRequest(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="leave_requests")
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    days_requested = models.DecimalField(max_digits=5, decimal_places=2, default=1)
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="Pending")
    rejection_reason = models.TextField(blank=True)
    applied_on = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def employee_name(self):
        return self.employee.full_name

    @property
    def leave_type_name(self):
        return self.leave_type.name


class LeaveApproval(models.Model):
    leave_request = models.ForeignKey(LeaveRequest, on_delete=models.CASCADE, related_name="approvals")
    approver = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True)
    approver_role = models.CharField(max_length=50)
    action = models.CharField(max_length=20)
    comment = models.TextField(blank=True)
    actioned_at = models.DateTimeField(auto_now_add=True)

    @property
    def approver_name(self):
        return self.approver.full_name if self.approver else ""


class LeaveAttachment(models.Model):
    leave_request = models.ForeignKey(LeaveRequest, on_delete=models.CASCADE, related_name="attachments")
    file = models.FileField(upload_to="leave/attachments/")
    description = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)


class PublicHoliday(models.Model):
    name = models.CharField(max_length=200)
    date = models.DateField()
    year = models.PositiveIntegerField()
    is_national = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.date})"
