from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    PayrollPolicyViewSet, TaxBandViewSet,
    StatutoryRateViewSet, PayComponentViewSet, EmployeePayComponentViewSet,
    PayrollRunViewSet, PayslipViewSet, AllowanceViewSet, DeductionViewSet,
    BankPaymentViewSet, generate_payroll,
)

router = DefaultRouter(trailing_slash=True)
router.register("payroll/runs", PayrollRunViewSet, basename="payroll-run")
router.register("payroll/payslips", PayslipViewSet, basename="payslip")
router.register("payroll/allowances", AllowanceViewSet, basename="allowance")
router.register("payroll/deductions", DeductionViewSet, basename="deduction")
router.register("payroll/bank-payments", BankPaymentViewSet, basename="bank-payment")
router.register("payroll/components", PayComponentViewSet, basename="pay-component")
router.register("payroll/employee-components", EmployeePayComponentViewSet, basename="employee-component")
router.register("payroll/tax-bands", TaxBandViewSet, basename="tax-band")
router.register("payroll/statutory-rates", StatutoryRateViewSet, basename="statutory-rate")

router.register("payroll/policies", PayrollPolicyViewSet, basename="payroll-policy")

urlpatterns = router.urls + [
    path("payroll/generate/", generate_payroll),
]
