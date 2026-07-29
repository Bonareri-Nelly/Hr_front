from rest_framework.routers import DefaultRouter
from .views import ContractViewSet, ContractRenewalViewSet, ContractTerminationViewSet

router = DefaultRouter(trailing_slash=True)
router.register("contracts", ContractViewSet, basename="contract")
router.register("contract-renewals", ContractRenewalViewSet, basename="contract-renewal")
router.register("contract-terminations", ContractTerminationViewSet, basename="contract-termination")

urlpatterns = router.urls
