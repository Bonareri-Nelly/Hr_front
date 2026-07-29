from django.contrib import admin
from .models import Contract, ContractRenewal, ContractTermination

admin.site.register(Contract)
admin.site.register(ContractRenewal)
admin.site.register(ContractTermination)
