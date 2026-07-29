from django.contrib import admin
from .models import LeaveType, LeaveBalance, LeaveRequest, LeaveApproval, LeaveAttachment, PublicHoliday

admin.site.register(LeaveType)
admin.site.register(LeaveBalance)
admin.site.register(LeaveRequest)
admin.site.register(LeaveApproval)
admin.site.register(LeaveAttachment)
admin.site.register(PublicHoliday)
