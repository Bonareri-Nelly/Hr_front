from rest_framework import serializers
from .models import PerformanceCycle, PerformanceGoal, PerformanceReview, GoalProgress


class PerformanceCycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceCycle
        fields = "__all__"


class PerformanceGoalSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()
    cycle_name = serializers.ReadOnlyField()

    class Meta:
        model = PerformanceGoal
        fields = "__all__"


class PerformanceReviewSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()
    cycle_name = serializers.ReadOnlyField()

    class Meta:
        model = PerformanceReview
        fields = "__all__"


class GoalProgressSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()

    class Meta:
        model = GoalProgress
        fields = "__all__"
