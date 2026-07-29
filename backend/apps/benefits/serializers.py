from rest_framework import serializers
from .models import BenefitPlan, BenefitWindow, BenefitEnrollment, BenefitContribution


class BenefitPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = BenefitPlan
        fields = "__all__"


class BenefitWindowSerializer(serializers.ModelSerializer):
    class Meta:
        model = BenefitWindow
        fields = "__all__"


class BenefitEnrollmentSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()
    plan_name = serializers.ReadOnlyField()

    class Meta:
        model = BenefitEnrollment
        fields = "__all__"


class BenefitContributionSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()

    class Meta:
        model = BenefitContribution
        fields = "__all__"
