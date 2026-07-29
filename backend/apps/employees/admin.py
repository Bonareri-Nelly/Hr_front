from django.contrib import admin
from .models import Branch, Department, Designation, Employee, Document, Education, WorkExperience, Dependant, Certification, Skill, BankAccount, Asset

admin.site.register(Branch)
admin.site.register(Department)
admin.site.register(Designation)


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ["employee_number", "first_name", "last_name", "department", "employment_status"]
    list_filter = ["employment_status", "employment_type", "branch", "department"]
    search_fields = ["first_name", "last_name", "email", "employee_number"]


admin.site.register(Document)
admin.site.register(Education)
admin.site.register(WorkExperience)
admin.site.register(Dependant)
admin.site.register(Certification)
admin.site.register(Skill)
admin.site.register(BankAccount)
admin.site.register(Asset)
