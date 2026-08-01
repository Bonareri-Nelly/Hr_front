from rest_framework import serializers
from .models import (
    HrPerformanceReview, HrPerformanceGoal, DisciplinaryCase,
    Announcement, Training, TrainingEnrollment,
)
from .models import RecruitmentApplication, Complaint
from django.utils.crypto import get_random_string


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


class RecruitmentApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruitmentApplication
        fields = "__all__"
        read_only_fields = ["reference", "stage", "decision_note", "submitted_at", "updated_at"]

    def create(self, validated_data):
        validated_data["reference"] = f"APP-{get_random_string(10).upper()}"
        return super().create(validated_data)


class ComplaintSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()

    class Meta:
        model = Complaint
        fields = "__all__"
        read_only_fields = ["employee", "reviewed_by", "status", "resolution_notes", "created_at", "updated_at"]
