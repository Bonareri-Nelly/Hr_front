"""Small, reusable server-side data-scope helpers for HR records."""
from django.db.models import QuerySet


def scoped_employee_ids(user) -> QuerySet:
    from apps.employees.models import Employee
    if user.is_superuser or user.role in {"System Admin", "Executive", "HR"}:
        return Employee.objects.values("id")
    if user.role == "Manager":
        return Employee.objects.filter(branch__name=user.branch_name).values("id")
    if user.role == "Department Head":
        return Employee.objects.filter(department__name=user.department_name).values("id")
    return Employee.objects.filter(id=user.employee_id).values("id")


def scope_employee_relation(queryset, user, field="employee_id"):
    return queryset.filter(**{f"{field}__in": scoped_employee_ids(user)})


def can_approve_leave(user) -> bool:
    return user.is_superuser or user.role in {"System Admin", "HR", "Manager", "Department Head"}


def can_manage_payroll(user) -> bool:
    """Payroll creation and pay-rule maintenance are limited to HR and Finance."""
    return user.is_superuser or user.role in {"System Admin", "HR", "Finance"}


def can_manage_benefits(user) -> bool:
    return user.is_superuser or user.role in {"System Admin", "Executive", "HR", "Finance", "Manager"}


def can_manage_performance(user) -> bool:
    return user.is_superuser or user.role in {"System Admin", "Executive", "HR", "Manager", "Department Head"}
