from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("apps.authentication.urls")),
    path("api/", include("apps.employees.urls")),
    path("api/", include("apps.attendance.urls")),
    path("api/", include("apps.leave.urls")),
    path("api/", include("apps.payroll.urls")),
    path("api/", include("apps.benefits.urls")),
    path("api/", include("apps.contracts.urls")),
    path("api/", include("apps.performance.urls")),
    path("api/", include("apps.hr_operations.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
