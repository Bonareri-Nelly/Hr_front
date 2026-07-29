from django.contrib import admin
from .models import HrPerformanceReview, HrPerformanceGoal, DisciplinaryCase, Announcement, Training, TrainingEnrollment

admin.site.register(HrPerformanceReview)
admin.site.register(HrPerformanceGoal)
admin.site.register(DisciplinaryCase)
admin.site.register(Announcement)
admin.site.register(Training)
admin.site.register(TrainingEnrollment)
