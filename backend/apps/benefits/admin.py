from django.contrib import admin
from .models import BenefitPlan, BenefitWindow, BenefitEnrollment, BenefitContribution

admin.site.register(BenefitPlan)
admin.site.register(BenefitWindow)
admin.site.register(BenefitEnrollment)
admin.site.register(BenefitContribution)
