from django.contrib import admin
from .models import WorkLocation, Shift, AttendanceRecord, LocationLog, CorrectionRequest, EmployeeAttendanceAssignment

admin.site.register(WorkLocation)
admin.site.register(Shift)
admin.site.register(AttendanceRecord)
admin.site.register(LocationLog)
admin.site.register(CorrectionRequest)
admin.site.register(EmployeeAttendanceAssignment)
