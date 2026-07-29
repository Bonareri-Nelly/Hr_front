from rest_framework import serializers
from .models import LeaveType, LeaveBalance, LeaveRequest, LeaveApproval, LeaveAttachment, PublicHoliday


class LeaveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = "__all__"


class LeaveBalanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()
    leave_type_name = serializers.ReadOnlyField()

    class Meta:
        model = LeaveBalance
        fields = "__all__"


class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()
    leave_type_name = serializers.ReadOnlyField()

    class Meta:
        model = LeaveRequest
        fields = "__all__"


class LeaveApprovalSerializer(serializers.ModelSerializer):
    approver_name = serializers.ReadOnlyField()

    class Meta:
        model = LeaveApproval
        fields = "__all__"


class LeaveAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveAttachment
        fields = "__all__"


class PublicHolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicHoliday
        fields = "__all__"
