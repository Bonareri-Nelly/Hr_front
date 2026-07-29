from django.contrib import admin
from .models import PayrollPolicy, TaxBand, StatutoryRate, PayComponent, EmployeePayComponent, PayrollRun, Payslip, Allowance, Deduction, BankPayment

admin.site.register(PayrollPolicy)
admin.site.register(TaxBand)
admin.site.register(StatutoryRate)
admin.site.register(PayComponent)
admin.site.register(EmployeePayComponent)
admin.site.register(PayrollRun)
admin.site.register(Payslip)
admin.site.register(Allowance)
admin.site.register(Deduction)
admin.site.register(BankPayment)
