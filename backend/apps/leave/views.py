from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import LeaveType, LeaveBalance, LeaveRequest, LeaveApproval, LeaveAttachment, PublicHoliday
from .serializers import (
    LeaveTypeSerializer, LeaveBalanceSerializer, LeaveRequestSerializer,
    LeaveApprovalSerializer, LeaveAttachmentSerializer, PublicHolidaySerializer,
)


class LeaveTypeViewSet(viewsets.ModelViewSet):
    queryset = LeaveType.objects.all()
    serializer_class = LeaveTypeSerializer


class LeaveBalanceViewSet(viewsets.ModelViewSet):
    queryset = LeaveBalance.objects.select_related("employee", "leave_type").all()
    serializer_class = LeaveBalanceSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs


class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.select_related("employee", "leave_type").all()
    serializer_class = LeaveRequestSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        status_filter = self.request.query_params.get("status")
        if employee:
            qs = qs.filter(employee_id=employee)
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs.order_by("-applied_on")

    @action(detail=True, methods=["post"], url_path="manager-approve")
    def manager_approve(self, request, pk=None):
        req = self.get_object()
        req.status = "Manager Approved"
        req.save()
        return Response(LeaveRequestSerializer(req).data)

    @action(detail=True, methods=["post"], url_path="hr-approve")
    def hr_approve(self, request, pk=None):
        req = self.get_object()
        req.status = "HR Approved"
        req.save()
        return Response(LeaveRequestSerializer(req).data)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        req = self.get_object()
        req.status = "Rejected"
        req.rejection_reason = request.data.get("reason", "")
        req.save()
        return Response(LeaveRequestSerializer(req).data)


class LeaveApprovalViewSet(viewsets.ModelViewSet):
    queryset = LeaveApproval.objects.all()
    serializer_class = LeaveApprovalSerializer


class LeaveAttachmentViewSet(viewsets.ModelViewSet):
    queryset = LeaveAttachment.objects.all()
    serializer_class = LeaveAttachmentSerializer


class PublicHolidayViewSet(viewsets.ModelViewSet):
    queryset = PublicHoliday.objects.all()
    serializer_class = PublicHolidaySerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_leave_request(request):
    serializer = LeaveRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)
