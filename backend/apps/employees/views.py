from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import (
    Branch, Department, Designation, Employee,
    Document, Education, WorkExperience, Dependant,
    Certification, Skill, BankAccount, Asset,
)
from apps.authentication.access import scope_employee_relation, scoped_employee_ids
from .serializers import (
    BranchSerializer, DepartmentSerializer, DesignationSerializer, EmployeeSerializer,
    DocumentSerializer, EducationSerializer, WorkExperienceSerializer, DependantSerializer,
    CertificationSerializer, SkillSerializer, BankAccountSerializer, AssetSerializer,
)


class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "code"]


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.select_related("branch").all()
    serializer_class = DepartmentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "code"]


class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.select_related("department").all()
    serializer_class = DesignationSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title"]


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related("branch", "department", "designation").all()
    serializer_class = EmployeeSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["first_name", "last_name", "email", "employee_number"]
    ordering_fields = ["last_name", "date_joined", "employment_status"]

    @action(detail=True, methods=["get"], url_path="contracts")
    def contracts(self, request, pk=None):
        from apps.contracts.models import Contract
        from apps.contracts.serializers import ContractSerializer
        contracts = Contract.objects.filter(employee_id=pk)
        return Response(ContractSerializer(contracts, many=True).data)


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.select_related("employee").all()
    serializer_class = DocumentSerializer

    def get_queryset(self):
        qs = scope_employee_relation(super().get_queryset(), self.request.user)
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs

    def perform_create(self, serializer):
        employee = serializer.validated_data["employee"]
        if not scoped_employee_ids(self.request.user).filter(id=employee.id).exists():
            raise PermissionDenied("You are not allowed to upload a document for this employee.")
        serializer.save()


class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.select_related("employee").all()
    serializer_class = EducationSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs


class WorkExperienceViewSet(viewsets.ModelViewSet):
    queryset = WorkExperience.objects.select_related("employee").all()
    serializer_class = WorkExperienceSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs


class DependantViewSet(viewsets.ModelViewSet):
    queryset = Dependant.objects.select_related("employee").all()
    serializer_class = DependantSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs


class CertificationViewSet(viewsets.ModelViewSet):
    queryset = Certification.objects.select_related("employee").all()
    serializer_class = CertificationSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.select_related("employee").all()
    serializer_class = SkillSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs


class BankAccountViewSet(viewsets.ModelViewSet):
    queryset = BankAccount.objects.select_related("employee").all()
    serializer_class = BankAccountSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.select_related("employee").all()
    serializer_class = AssetSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        employee = self.request.query_params.get("employee")
        if employee:
            qs = qs.filter(employee_id=employee)
        return qs
