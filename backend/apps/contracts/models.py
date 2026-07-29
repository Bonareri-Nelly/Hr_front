from django.db import models
from apps.employees.models import Employee


CONTRACT_STATUS = [
    ("Draft", "Draft"), ("Active", "Active"), ("Expired", "Expired"),
    ("Terminated", "Terminated"), ("Renewed", "Renewed"),
]
CONTRACT_TYPE = [
    ("Permanent", "Permanent"), ("Fixed-Term", "Fixed-Term"),
    ("Probation", "Probation"), ("Internship", "Internship"), ("Contract", "Contract"),
]


class Contract(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="contracts")
    contract_type = models.CharField(max_length=20, choices=CONTRACT_TYPE, default="Permanent")
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=CONTRACT_STATUS, default="Active")
    gross_salary = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    job_title = models.CharField(max_length=200, blank=True)
    department = models.CharField(max_length=200, blank=True)
    terms = models.TextField(blank=True)
    document = models.FileField(upload_to="contracts/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def employee_name(self):
        return self.employee.full_name

    @property
    def days_to_expiry(self):
        if not self.end_date:
            return None
        from django.utils import timezone
        delta = self.end_date - timezone.now().date()
        return delta.days


class ContractRenewal(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="renewals")
    new_start_date = models.DateField()
    new_end_date = models.DateField(null=True, blank=True)
    new_salary = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    reason = models.TextField(blank=True)
    renewed_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="contract_renewals")
    renewed_at = models.DateTimeField(auto_now_add=True)

    @property
    def employee_name(self):
        return self.contract.employee.full_name


class ContractTermination(models.Model):
    TERMINATION_TYPE = [
        ("Resignation", "Resignation"), ("Dismissal", "Dismissal"),
        ("Redundancy", "Redundancy"), ("Retirement", "Retirement"), ("Mutual", "Mutual"),
    ]
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="terminations")
    termination_type = models.CharField(max_length=30, choices=TERMINATION_TYPE)
    termination_date = models.DateField()
    notice_date = models.DateField(null=True, blank=True)
    reason = models.TextField()
    final_pay = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    terminated_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="contract_terminations")
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def employee_name(self):
        return self.contract.employee.full_name
