from django.contrib import admin
from .models import PerformanceCycle, PerformanceGoal, PerformanceReview, GoalProgress

admin.site.register(PerformanceCycle)
admin.site.register(PerformanceGoal)
admin.site.register(PerformanceReview)
admin.site.register(GoalProgress)
