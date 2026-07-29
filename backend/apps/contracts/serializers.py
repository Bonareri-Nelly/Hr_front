from rest_framework import serializers
from .models import Contract, ContractRenewal, ContractTermination


class ContractSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()
    days_to_expiry = serializers.ReadOnlyField()

    class Meta:
        model = Contract
        fields = "__all__"


class ContractRenewalSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()

    class Meta:
        model = ContractRenewal
        fields = "__all__"


class ContractTerminationSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()

    class Meta:
        model = ContractTermination
        fields = "__all__"
