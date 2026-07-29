from rest_framework import serializers
from .models import (
    HrPerformanceReview, HrPerformanceGoal, DisciplinaryCase,
    Announcement, Training, TrainingEnrollment,
)


class HrPerformanceReviewSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()

    class Meta:
        model = HrPerformanceReview
        fields = "__all__"


class HrPerformanceGoalSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()

    class Meta:
        model = HrPerformanceGoal
        fields = "__all__"


class DisciplinaryCaseSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()

    class Meta:
        model = DisciplinaryCase
        fields = "__all__"


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = "__all__"


class TrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = "__all__"


class TrainingEnrollmentSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()
    training_title = serializers.ReadOnlyField()

    class Meta:
        model = TrainingEnrollment
        fields = "__all__"
