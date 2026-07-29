from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Contract, ContractRenewal, ContractTermination
from .serializers import ContractSerializer, ContractRenewalSerializer, ContractTerminationSerializer


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.select_related("employee").all()
    serializer_class = ContractSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs.order_by("-created_at")

    @action(detail=False, methods=["get"])
    def expiring(self, request):
        threshold = timezone.now().date()
        from datetime import timedelta
        in_60_days = threshold + timedelta(days=60)
        contracts = Contract.objects.filter(
            end_date__gte=threshold, end_date__lte=in_60_days, status="Active"
        ).select_related("employee")
        return Response(ContractSerializer(contracts, many=True).data)

    @action(detail=True, methods=["post"])
    def renew(self, request, pk=None):
        contract = self.get_object()
        data = {**request.data, "contract": contract.id}
        serializer = ContractRenewalSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        renewal = serializer.save()
        contract.status = "Renewed"
        if renewal.new_end_date:
            contract.end_date = renewal.new_end_date
        if renewal.new_salary:
            contract.gross_salary = renewal.new_salary
        contract.save()
        return Response(ContractSerializer(contract).data)

    @action(detail=True, methods=["post"])
    def terminate(self, request, pk=None):
        contract = self.get_object()
        data = {**request.data, "contract": contract.id}
        serializer = ContractTerminationSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        contract.status = "Terminated"
        contract.save()
        return Response(ContractSerializer(contract).data)


class ContractRenewalViewSet(viewsets.ModelViewSet):
    queryset = ContractRenewal.objects.all()
    serializer_class = ContractRenewalSerializer


class ContractTerminationViewSet(viewsets.ModelViewSet):
    queryset = ContractTermination.objects.all()
    serializer_class = ContractTerminationSerializer
