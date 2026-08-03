from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path("auth/login/", views.login_view),
    path("auth/register/", views.register_view),
    path("auth/logout/", views.logout_view),
    path("auth/token/refresh/", TokenRefreshView.as_view()),
    path("auth/me/", views.me_view),
    path("auth/profile/", views.profile_view),
    path("auth/change-password/", views.change_password_view),
    path("security-audit/scan/", views.security_scan_view),
]
