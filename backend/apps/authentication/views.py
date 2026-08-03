from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.utils import timezone

from .models import User
from .serializers import (
    UserSerializer, LoginSerializer, RegisterSerializer,
    ChangePasswordSerializer, ProfileUpdateSerializer,
)


def tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data["user"]
    tokens = tokens_for_user(user)
    return Response({**tokens, "user": UserSerializer(user).data})


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    tokens = tokens_for_user(user)
    return Response({**tokens, "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
    except TokenError:
        pass
    return Response({"message": "Logged out successfully."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    return Response(UserSerializer(request.user).data)


@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    serializer = ProfileUpdateSerializer(
        request.user, data=request.data,
        partial=(request.method == "PATCH"),
        context={"request": request},
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({"user": UserSerializer(request.user).data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    request.user.set_password(serializer.validated_data["new_password"])
    request.user.save()
    return Response({"message": "Password changed successfully."})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def security_scan_view(request):
    """Run a non-invasive configuration scan of this HRMS instance.

    This deliberately checks application controls; it does not probe hosts or
    execute external security tooling from a web request.
    """
    if not (request.user.is_superuser or request.user.role in {"System Admin", "Executive"}):
        return Response({"detail": "You are not allowed to run a security scan."}, status=status.HTTP_403_FORBIDDEN)
    findings = []
    if settings.DEBUG:
        findings.append({"severity": "high", "control": "Production debug mode", "detail": "DEBUG is enabled. Disable it before production deployment.", "recommendation": "Set DEBUG=false in the production environment."})
    if "*" in settings.ALLOWED_HOSTS:
        findings.append({"severity": "medium", "control": "Allowed hosts", "detail": "ALLOWED_HOSTS accepts every host.", "recommendation": "Restrict ALLOWED_HOSTS to approved domains."})
    if getattr(settings, "CORS_ALLOW_ALL_ORIGINS", False):
        findings.append({"severity": "medium", "control": "Cross-origin policy", "detail": "CORS allows all origins.", "recommendation": "Allow only the deployed frontend origin."})
    if settings.SECRET_KEY.startswith("hr-payroll-dev-"):
        findings.append({"severity": "high", "control": "Secret key", "detail": "The development fallback secret key is active.", "recommendation": "Set a unique DJANGO_SECRET_KEY in the production environment."})
    score = max(0, 100 - sum({"high": 20, "medium": 10, "low": 5}[item["severity"]] for item in findings))
    return Response({"completed_at": timezone.now().isoformat(), "score": score, "systems_checked": 4, "findings": findings, "issues": len(findings), "fixes": 0})
