from rest_framework import serializers
from .models import (
    PayrollPolicy, TaxBand, StatutoryRate,
    PayComponent, EmployeePayComponent, PayrollRun, Payslip,
    Allowance, Deduction, BankPayment,
)


class PayrollPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollPolicy
        fields = "__all__"


class TaxBandSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxBand
        fields = "__all__"


class StatutoryRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatutoryRate
        fields = "__all__"


class PayComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayComponent
        fields = "__all__"


class EmployeePayComponentSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()
    component_name = serializers.ReadOnlyField()

    class Meta:
        model = EmployeePayComponent
        fields = "__all__"


class AllowanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allowance
        fields = "__all__"


class DeductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deduction
        fields = "__all__"


class BankPaymentSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()

    class Meta:
        model = BankPayment
        fields = "__all__"


class PayslipSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField()
    allowances = AllowanceSerializer(many=True, read_only=True)
    deductions = DeductionSerializer(many=True, read_only=True)

    class Meta:
        model = Payslip
        fields = "__all__"


class PayrollRunSerializer(serializers.ModelSerializer):
    branch_name = serializers.ReadOnlyField()

    class Meta:
        model = PayrollRun
        fields = "__all__"
