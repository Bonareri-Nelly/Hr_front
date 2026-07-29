from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["username", "email", "role", "is_active", "is_staff"]
    list_filter = ["role", "is_active", "is_staff"]
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal", {"fields": ("first_name", "last_name", "email", "phone_number")}),
        ("Role & Access", {"fields": ("role", "is_active", "is_staff", "is_approved", "is_superuser")}),
        ("Employment", {"fields": ("employee_id", "branch_name", "department_name")}),
    )
    add_fieldsets = (
        (None, {"fields": ("username", "password1", "password2", "role")}),
    )
    search_fields = ["username", "email", "first_name", "last_name"]
    ordering = ["username"]
