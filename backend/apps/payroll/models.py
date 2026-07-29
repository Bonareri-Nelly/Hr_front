from django.db import models
from apps.employees.models import Employee, Branch


PAYROLL_STATUS = [
    ("Draft", "Draft"), ("Submitted", "Submitted"), ("Approved", "Approved"),
    ("Finalized", "Finalized"), ("Cancelled", "Cancelled"),
]



class PayrollPolicy(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    pay_frequency = models.CharField(max_length=20, default="Monthly")
    payment_day = models.PositiveIntegerField(default=28)
    overtime_rate = models.DecimalField(max_digits=5, decimal_places=2, default=1.5)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


class TaxBand(models.Model):
    name = models.CharField(max_length=100)
    min_income = models.DecimalField(max_digits=14, decimal_places=2)
    max_income = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    rate = models.DecimalField(max_digits=5, decimal_places=4)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class StatutoryRate(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    employee_rate = models.DecimalField(max_digits=7, decimal_places=4, default=0)
    employer_rate = models.DecimalField(max_digits=7, decimal_places=4, default=0)
    is_percentage = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    effective_from = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class PayComponent(models.Model):
    COMPONENT_TYPE = [("Allowance", "Allowance"), ("Deduction", "Deduction"), ("Statutory", "Statutory")]
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=30, unique=True)
    component_type = models.CharField(max_length=20, choices=COMPONENT_TYPE)
    is_taxable = models.BooleanField(default=True)
    is_fixed = models.BooleanField(default=True)
    default_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class EmployeePayComponent(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="pay_components")
    component = models.ForeignKey(PayComponent, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def employee_name(self):
        return self.employee.full_name

    @property
    def component_name(self):
        return self.component.name


class PayrollRun(models.Model):
    name = models.CharField(max_length=200)
    period_start = models.DateField()
    period_end = models.DateField()
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
    currency_code = models.CharField(max_length=5, default="KES")
    status = models.CharField(max_length=20, choices=PAYROLL_STATUS, default="Draft")
    total_gross = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    total_net = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    employee_count = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="created_payrolls")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.period_start} to {self.period_end})"

    @property
    def branch_name(self):
        return self.branch.name if self.branch else ""


class Payslip(models.Model):
    payroll_run = models.ForeignKey(PayrollRun, on_delete=models.CASCADE, related_name="payslips")
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="payslips")
    gross_pay = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_allowances = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    net_pay = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    payment_date = models.DateField(null=True, blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def employee_name(self):
        return self.employee.full_name


class Allowance(models.Model):
    payslip = models.ForeignKey(Payslip, on_delete=models.CASCADE, related_name="allowances")
    name = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    is_taxable = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Deduction(models.Model):
    payslip = models.ForeignKey(Payslip, on_delete=models.CASCADE, related_name="deductions")
    name = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    deduction_type = models.CharField(max_length=50, default="Other")
    created_at = models.DateTimeField(auto_now_add=True)


class BankPayment(models.Model):
    STATUS = [("Pending", "Pending"), ("Processed", "Processed"), ("Failed", "Failed")]
    payslip = models.ForeignKey(Payslip, on_delete=models.CASCADE, related_name="bank_payments", null=True, blank=True)
    payroll_run = models.ForeignKey(PayrollRun, on_delete=models.CASCADE, related_name="bank_payments", null=True, blank=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="bank_payments")
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    bank_name = models.CharField(max_length=200, blank=True)
    account_number = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default="Pending")
    reference = models.CharField(max_length=100, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def employee_name(self):
        return self.employee.full_name
