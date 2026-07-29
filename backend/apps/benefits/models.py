from django.db import models
from apps.employees.models import Employee


class BenefitPlan(models.Model):
    name = models.CharField(max_length=200)
    plan_type = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    provider = models.CharField(max_length=200, blank=True)
    employee_contribution = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    employer_contribution = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_percentage = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class BenefitWindow(models.Model):
    name = models.CharField(max_length=200)
    open_date = models.DateField()
    close_date = models.DateField()
    is_active = models.BooleanField(default=True)
    plans = models.ManyToManyField(BenefitPlan, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class BenefitEnrollment(models.Model):
    STATUS = [("Pending", "Pending"), ("Approved", "Approved"), ("Rejected", "Rejected"), ("Cancelled", "Cancelled")]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="benefit_enrollments")
    plan = models.ForeignKey(BenefitPlan, on_delete=models.CASCADE)
    enrollment_window = models.ForeignKey(BenefitWindow, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default="Pending")
    employee_contribution = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    employer_contribution = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def employee_name(self):
        return self.employee.full_name

    @property
    def plan_name(self):
        return self.plan.name


class BenefitContribution(models.Model):
    enrollment = models.ForeignKey(BenefitEnrollment, on_delete=models.CASCADE, related_name="contributions")
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="benefit_contributions")
    period = models.CharField(max_length=20)
    employee_amount = models.DecimalField(max_digits=10, decimal_places=2)
    employer_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def employee_name(self):
        return self.employee.full_name
