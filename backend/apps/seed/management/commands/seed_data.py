"""
Seed the database with realistic HR & Payroll demo data.
Run: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
import random


class Command(BaseCommand):
    help = "Seed the database with demo data"

    def handle(self, *args, **options):
        self.stdout.write("Seeding database...")
        self._seed_users()
        self._seed_org()
        self._seed_employees()
        self._seed_leave()
        self._seed_payroll()
        self._seed_performance()
        self._seed_hr_operations()
        self._seed_benefits()
        self._seed_contracts()
        self.stdout.write(self.style.SUCCESS("✓ Database seeded successfully."))

    # ------------------------------------------------------------------
    def _seed_users(self):
        from apps.authentication.models import User
        users = [
            dict(username="admin", password="Admin1234!", role="System Admin", first_name="System", last_name="Admin", email="admin@optimum.co.ke", is_staff=True, is_superuser=True),
            dict(username="executive", password="Pass1234!", role="Executive", first_name="James", last_name="Kamau", email="jkamau@optimum.co.ke"),
            dict(username="hr_manager", password="Pass1234!", role="HR", first_name="Grace", last_name="Wanjiku", email="gwanjiku@optimum.co.ke"),
            dict(username="finance_manager", password="Pass1234!", role="Finance", first_name="Peter", last_name="Otieno", email="potieno@optimum.co.ke"),
            dict(username="dept_head", password="Pass1234!", role="Department Head", first_name="Sarah", last_name="Mutua", email="smutua@optimum.co.ke"),
            dict(username="manager", password="Pass1234!", role="Manager", first_name="David", last_name="Njoroge", email="dnjoroge@optimum.co.ke"),
            dict(username="employee1", password="Pass1234!", role="Employee", first_name="Alice", last_name="Achieng", email="aachieng@optimum.co.ke", employee_id=1),
            dict(username="employee2", password="Pass1234!", role="Employee", first_name="Brian", last_name="Odhiambo", email="bodhiambo@optimum.co.ke", employee_id=2),
        ]
        for u in users:
            pwd = u.pop("password")
            if not User.objects.filter(username=u["username"]).exists():
                User.objects.create_user(password=pwd, **u)
        self.stdout.write("  ✓ Users")

    def _seed_org(self):
        from apps.employees.models import Branch, Department, Designation
        branches = [
            dict(name="Nairobi HQ", code="NBI", location="Westlands, Nairobi"),
            dict(name="Mombasa", code="MSA", location="Nyali, Mombasa"),
            dict(name="Kisumu", code="KSM", location="Milimani, Kisumu"),
            dict(name="Nakuru", code="NKR", location="CBD, Nakuru"),
        ]
        br_objs = {}
        for b in branches:
            obj, _ = Branch.objects.get_or_create(code=b["code"], defaults=b)
            br_objs[b["code"]] = obj

        depts = [
            dict(name="Human Resources", code="HR", branch=br_objs["NBI"]),
            dict(name="Finance", code="FIN", branch=br_objs["NBI"]),
            dict(name="Information Technology", code="IT", branch=br_objs["NBI"]),
            dict(name="Operations", code="OPS", branch=br_objs["MSA"]),
            dict(name="Sales & Marketing", code="SM", branch=br_objs["KSM"]),
            dict(name="Customer Service", code="CS", branch=br_objs["NKR"]),
        ]
        dept_objs = {}
        for d in depts:
            obj, _ = Department.objects.get_or_create(code=d["code"], defaults=d)
            dept_objs[d["code"]] = obj

        designations = [
            dict(title="HR Manager", department=dept_objs["HR"], grade="M3"),
            dict(title="HR Officer", department=dept_objs["HR"], grade="P2"),
            dict(title="Finance Manager", department=dept_objs["FIN"], grade="M3"),
            dict(title="Accountant", department=dept_objs["FIN"], grade="P2"),
            dict(title="Software Engineer", department=dept_objs["IT"], grade="P3"),
            dict(title="IT Support", department=dept_objs["IT"], grade="P1"),
            dict(title="Operations Manager", department=dept_objs["OPS"], grade="M2"),
            dict(title="Sales Executive", department=dept_objs["SM"], grade="P1"),
            dict(title="Customer Service Rep", department=dept_objs["CS"], grade="P1"),
        ]
        for d in designations:
            Designation.objects.get_or_create(title=d["title"], department=d["department"], defaults=d)
        self.stdout.write("  ✓ Organisation (branches, departments, designations)")

    def _seed_employees(self):
        from apps.employees.models import Branch, Department, Designation, Employee, BankAccount
        hr_dept = Department.objects.filter(code="HR").first()
        fin_dept = Department.objects.filter(code="FIN").first()
        it_dept = Department.objects.filter(code="IT").first()
        ops_dept = Department.objects.filter(code="OPS").first()
        nairobi = Branch.objects.filter(code="NBI").first()
        mombasa = Branch.objects.filter(code="MSA").first()

        employees_data = [
            dict(employee_number="EMP001", first_name="Alice", last_name="Achieng", email="alice.achieng@optimum.co.ke",
                 gender="Female", date_of_birth=date(1992, 4, 15), date_joined=date(2019, 3, 1),
                 branch=nairobi, department=hr_dept, gross_salary=85000, employment_type="Full-Time"),
            dict(employee_number="EMP002", first_name="Brian", last_name="Odhiambo", email="brian.odhiambo@optimum.co.ke",
                 gender="Male", date_of_birth=date(1990, 8, 22), date_joined=date(2018, 6, 15),
                 branch=nairobi, department=fin_dept, gross_salary=95000, employment_type="Full-Time"),
            dict(employee_number="EMP003", first_name="Catherine", last_name="Njeri", email="catherine.njeri@optimum.co.ke",
                 gender="Female", date_of_birth=date(1988, 11, 3), date_joined=date(2017, 1, 10),
                 branch=nairobi, department=it_dept, gross_salary=120000, employment_type="Full-Time"),
            dict(employee_number="EMP004", first_name="Daniel", last_name="Kiprop", email="daniel.kiprop@optimum.co.ke",
                 gender="Male", date_of_birth=date(1994, 2, 28), date_joined=date(2021, 9, 1),
                 branch=mombasa, department=ops_dept, gross_salary=72000, employment_type="Full-Time"),
            dict(employee_number="EMP005", first_name="Esther", last_name="Wambui", email="esther.wambui@optimum.co.ke",
                 gender="Female", date_of_birth=date(1991, 7, 19), date_joined=date(2020, 2, 1),
                 branch=nairobi, department=fin_dept, gross_salary=78000, employment_type="Full-Time"),
            dict(employee_number="EMP006", first_name="Frank", last_name="Mwangi", email="frank.mwangi@optimum.co.ke",
                 gender="Male", date_of_birth=date(1987, 5, 10), date_joined=date(2016, 4, 15),
                 branch=nairobi, department=it_dept, gross_salary=130000, employment_type="Full-Time"),
            dict(employee_number="EMP007", first_name="Grace", last_name="Chebet", email="grace.chebet@optimum.co.ke",
                 gender="Female", date_of_birth=date(1993, 9, 8), date_joined=date(2019, 11, 1),
                 branch=mombasa, department=ops_dept, gross_salary=65000, employment_type="Contract"),
            dict(employee_number="EMP008", first_name="Henry", last_name="Otieno", email="henry.otieno@optimum.co.ke",
                 gender="Male", date_of_birth=date(1985, 12, 25), date_joined=date(2015, 7, 1),
                 branch=nairobi, department=hr_dept, gross_salary=110000, employment_type="Full-Time"),
        ]
        emp_objs = []
        for d in employees_data:
            obj, _ = Employee.objects.get_or_create(employee_number=d["employee_number"], defaults=d)
            emp_objs.append(obj)
            # Seed bank account
            if not obj.bank_accounts.exists():
                BankAccount.objects.create(
                    employee=obj, bank_name="Kenya Commercial Bank",
                    account_number=f"1234{obj.id:06d}",
                    account_name=obj.full_name, is_primary=True,
                )
        self.stdout.write(f"  ✓ Employees ({len(emp_objs)})")

    def _seed_leave(self):
        from apps.employees.models import Employee
        from apps.leave.models import LeaveType, LeaveBalance, LeaveRequest, PublicHoliday

        leave_types = [
            dict(name="Annual Leave", code="AL", max_days_per_year=21, is_paid=True),
            dict(name="Sick Leave", code="SL", max_days_per_year=14, is_paid=True, requires_attachment=True),
            dict(name="Maternity Leave", code="ML", max_days_per_year=90, is_paid=True),
            dict(name="Paternity Leave", code="PL", max_days_per_year=14, is_paid=True),
            dict(name="Unpaid Leave", code="UL", max_days_per_year=30, is_paid=False),
            dict(name="Emergency Leave", code="EL", max_days_per_year=5, is_paid=True),
        ]
        lt_objs = {}
        for lt in leave_types:
            obj, _ = LeaveType.objects.get_or_create(code=lt["code"], defaults=lt)
            lt_objs[lt["code"]] = obj

        year = timezone.now().year
        employees = Employee.objects.all()
        for emp in employees:
            for lt in lt_objs.values():
                taken = random.randint(0, min(5, lt.max_days_per_year))
                LeaveBalance.objects.get_or_create(
                    employee=emp, leave_type=lt, year=year,
                    defaults=dict(
                        entitled_days=lt.max_days_per_year,
                        taken_days=taken,
                        pending_days=0,
                        remaining_days=lt.max_days_per_year - taken,
                    )
                )

        holidays = [
            dict(name="New Year's Day", date=date(year, 1, 1), year=year),
            dict(name="Labour Day", date=date(year, 5, 1), year=year),
            dict(name="Madaraka Day", date=date(year, 6, 1), year=year),
            dict(name="Jamhuri Day", date=date(year, 12, 12), year=year),
            dict(name="Christmas Day", date=date(year, 12, 25), year=year),
        ]
        for h in holidays:
            PublicHoliday.objects.get_or_create(name=h["name"], year=year, defaults=h)

        # Sample leave requests
        requests = [
            dict(status="Pending", days_requested=3, reason="Family holiday"),
            dict(status="Manager Approved", days_requested=1, reason="Medical appointment"),
            dict(status="HR Approved", days_requested=5, reason="Annual holiday"),
            dict(status="Rejected", days_requested=2, reason="Personal matters", rejection_reason="Insufficient leave balance"),
        ]
        employees_list = list(employees)
        al = lt_objs.get("AL")
        if al and employees_list:
            for i, req_data in enumerate(requests):
                emp = employees_list[i % len(employees_list)]
                start = date.today() + timedelta(days=7 + i * 14)
                LeaveRequest.objects.get_or_create(
                    employee=emp, leave_type=al, start_date=start,
                    defaults=dict(
                        end_date=start + timedelta(days=req_data["days_requested"] - 1),
                        **req_data,
                    )
                )
        self.stdout.write("  ✓ Leave types, balances, and requests")

    def _seed_payroll(self):
        from apps.employees.models import Employee, Branch
        from apps.payroll.models import (
            PayrollRun, Payslip, TaxBand, StatutoryRate,
            PayrollPolicy, PayComponent,
        )

        PayrollPolicy.objects.get_or_create(
            name="Standard Monthly Policy",
            defaults=dict(pay_frequency="Monthly", payment_day=28, overtime_rate=1.5)
        )

        tax_bands = [
            dict(name="Tax Free Band", min_income=0, max_income=24000, rate=0),
            dict(name="10% Band", min_income=24001, max_income=32333, rate=0.10),
            dict(name="25% Band", min_income=32334, max_income=500000, rate=0.25),
            dict(name="30% Band", min_income=500001, max_income=800000, rate=0.30),
            dict(name="35% Band", min_income=800001, max_income=None, rate=0.35),
        ]
        for tb in tax_bands:
            TaxBand.objects.get_or_create(name=tb["name"], defaults=tb)

        statutory = [
            dict(name="NHIF", code="NHIF", employee_rate=0.0150, employer_rate=0, is_percentage=True),
            dict(name="NSSF", code="NSSF", employee_rate=0.06, employer_rate=0.06, is_percentage=True),
            dict(name="Housing Levy", code="AHL", employee_rate=0.015, employer_rate=0.015, is_percentage=True),
        ]
        for s in statutory:
            StatutoryRate.objects.get_or_create(code=s["code"], defaults=s)

        components = [
            dict(name="Basic Salary", code="BASIC", component_type="Allowance", is_taxable=True, is_fixed=True),
            dict(name="House Allowance", code="HOUSE", component_type="Allowance", is_taxable=False, default_amount=15000),
            dict(name="Transport Allowance", code="TRANSPORT", component_type="Allowance", is_taxable=False, default_amount=5000),
            dict(name="PAYE Tax", code="PAYE", component_type="Deduction", is_taxable=False, is_fixed=False),
            dict(name="NHIF", code="NHIF_DED", component_type="Statutory", is_taxable=False, is_fixed=False),
            dict(name="NSSF", code="NSSF_DED", component_type="Statutory", is_taxable=False, is_fixed=False),
        ]
        for c in components:
            PayComponent.objects.get_or_create(code=c["code"], defaults=c)

        nairobi = Branch.objects.filter(code="NBI").first()
        mombasa = Branch.objects.filter(code="MSA").first()
        today = date.today()

        runs_data = [
            dict(name="June 2026 Payroll – Nairobi HQ", period_start=date(2026, 6, 1), period_end=date(2026, 6, 30),
                 branch=nairobi, currency_code="KES", status="Finalized",
                 total_gross=850000, total_deductions=255000, total_net=595000, employee_count=6),
            dict(name="July 2026 Payroll – Nairobi HQ", period_start=date(2026, 7, 1), period_end=date(2026, 7, 31),
                 branch=nairobi, currency_code="KES", status="Approved",
                 total_gross=870000, total_deductions=261000, total_net=609000, employee_count=6),
            dict(name="July 2026 Payroll – Mombasa", period_start=date(2026, 7, 1), period_end=date(2026, 7, 31),
                 branch=mombasa, currency_code="KES", status="Submitted",
                 total_gross=340000, total_deductions=102000, total_net=238000, employee_count=2),
        ]
        employees = list(Employee.objects.all())
        for rd in runs_data:
            run, created = PayrollRun.objects.get_or_create(name=rd["name"], defaults=rd)
            if created and employees:
                for emp in employees[:rd["employee_count"]]:
                    gross = float(emp.gross_salary)
                    ded = gross * 0.3
                    Payslip.objects.create(
                        payroll_run=run, employee=emp,
                        gross_pay=gross, total_allowances=gross * 0.2,
                        total_deductions=ded, tax_amount=gross * 0.15,
                        net_pay=gross - ded, is_published=(run.status == "Finalized"),
                    )
        self.stdout.write("  ✓ Payroll (currencies, tax bands, statutory rates, runs, payslips)")

    def _seed_performance(self):
        from apps.employees.models import Employee
        from apps.performance.models import PerformanceCycle, PerformanceGoal, PerformanceReview

        cycle, _ = PerformanceCycle.objects.get_or_create(
            name="2026 Annual Review",
            defaults=dict(period_start=date(2026, 1, 1), period_end=date(2026, 12, 31), status="Active")
        )
        mid_cycle, _ = PerformanceCycle.objects.get_or_create(
            name="2026 Mid-Year Review",
            defaults=dict(period_start=date(2026, 1, 1), period_end=date(2026, 6, 30), status="Completed")
        )

        employees = list(Employee.objects.all())
        goal_titles = [
            "Improve team onboarding process by 30%",
            "Complete IPSAS training and certification",
            "Reduce payroll processing time to 2 days",
            "Implement new HRIS module by Q3",
            "Achieve 95% employee satisfaction score",
            "Reduce operational costs by 15%",
        ]
        statuses = ["Not Started", "In Progress", "In Progress", "Completed"]
        for i, emp in enumerate(employees):
            title = goal_titles[i % len(goal_titles)]
            PerformanceGoal.objects.get_or_create(
                employee=emp, title=title, cycle=cycle,
                defaults=dict(
                    target_date=date(2026, 12, 31),
                    status=random.choice(statuses),
                    progress=random.randint(10, 90),
                )
            )

        review_statuses = ["Draft", "Submitted", "Manager Approved", "HR Approved", "Finalized"]
        ratings = [3.2, 3.8, 4.1, 4.5, 3.6, 4.8]
        for i, emp in enumerate(employees):
            PerformanceReview.objects.get_or_create(
                employee=emp, cycle=mid_cycle,
                defaults=dict(
                    review_period_start=date(2026, 1, 1),
                    review_period_end=date(2026, 6, 30),
                    overall_rating=ratings[i % len(ratings)],
                    status=review_statuses[i % len(review_statuses)],
                    employee_comments="Good progress on all goals.",
                    manager_comments="Strong performer.",
                )
            )
        self.stdout.write("  ✓ Performance cycles, goals, and reviews")

    def _seed_hr_operations(self):
        from apps.employees.models import Employee
        from apps.hr_operations.models import Announcement, Training, DisciplinaryCase

        announcements = [
            dict(title="Q3 Performance Review Kickoff", content="All line managers are required to initiate Q3 performance reviews for their direct reports by July 31, 2026. Please log in to the HRIS system and complete the review forms.", priority="High", target_audience="Managers", is_active=True),
            dict(title="System Maintenance – July 28, 2026", content="The HRIS system will be down for scheduled maintenance on Monday, July 28 from 10 PM to 2 AM EAT. Please save all work before this time.", priority="Normal", target_audience="All", is_active=True),
            dict(title="New Leave Policy Effective August 2026", content="Following the HR policy review, annual leave carry-over limits will be updated. Employees can carry over a maximum of 10 days effective 1 August 2026.", priority="High", target_audience="All", is_active=True),
            dict(title="Employee Wellness Programme Launch", content="We are pleased to announce the launch of the Optimum Employee Wellness Programme. All staff are encouraged to register for the inaugural workshop on August 5, 2026.", priority="Normal", target_audience="All", is_active=True),
        ]
        emp = Employee.objects.first()
        for a in announcements:
            Announcement.objects.get_or_create(title=a["title"], defaults={**a, "author": emp, "published_at": timezone.now()})

        trainings = [
            dict(title="Data Privacy & GDPR Compliance", trainer="External Consultant", venue="Boardroom A", start_date=date(2026, 8, 5), end_date=date(2026, 8, 5), status="Upcoming", is_mandatory=True),
            dict(title="Leadership Excellence Programme", trainer="Dr. M. Kamau", venue="Conference Hall", start_date=date(2026, 8, 12), end_date=date(2026, 8, 14), status="Upcoming", is_mandatory=False),
            dict(title="Excel Advanced Skills", trainer="IT Department", venue="Computer Lab", start_date=date(2026, 7, 15), end_date=date(2026, 7, 15), status="Completed", is_mandatory=False),
            dict(title="Fire Safety & First Aid", trainer="Red Cross Kenya", venue="Car Park", start_date=date(2026, 9, 3), end_date=date(2026, 9, 3), status="Upcoming", is_mandatory=True),
        ]
        for t in trainings:
            Training.objects.get_or_create(title=t["title"], defaults=t)

        if emp:
            DisciplinaryCase.objects.get_or_create(
                case_number="DISC-2026-001",
                defaults=dict(
                    employee=emp,
                    incident_date=date(2026, 5, 10),
                    severity="Minor",
                    description="Repeated late arrival to work.",
                    status="Resolved",
                    resolution_notes="Employee issued a written warning. No further incidents since.",
                    resolved_at=timezone.now(),
                )
            )
        self.stdout.write("  ✓ Announcements, trainings, disciplinary cases")

    def _seed_benefits(self):
        from apps.employees.models import Employee
        from apps.benefits.models import BenefitPlan, BenefitWindow, BenefitEnrollment

        plans = [
            dict(name="Medical Cover – Individual", plan_type="Medical", provider="AAR Insurance", employee_contribution=2500, employer_contribution=7500),
            dict(name="Medical Cover – Family", plan_type="Medical", provider="AAR Insurance", employee_contribution=5000, employer_contribution=15000),
            dict(name="Pension Plan", plan_type="Pension", provider="NSSF+", employee_contribution=6, employer_contribution=6, is_percentage=True),
            dict(name="Group Life Insurance", plan_type="Life Insurance", provider="Britam", employee_contribution=0, employer_contribution=2000),
        ]
        plan_objs = []
        for p in plans:
            obj, _ = BenefitPlan.objects.get_or_create(name=p["name"], defaults=p)
            plan_objs.append(obj)

        window, _ = BenefitWindow.objects.get_or_create(
            name="2026 Open Enrollment",
            defaults=dict(open_date=date(2026, 7, 1), close_date=date(2026, 7, 31), is_active=True)
        )

        employees = list(Employee.objects.all())
        enrollment_statuses = ["Approved", "Approved", "Pending", "Approved"]
        for emp in employees[:4]:
            for i, plan in enumerate(plan_objs[:2]):
                BenefitEnrollment.objects.get_or_create(
                    employee=emp, plan=plan,
                    defaults=dict(
                        enrollment_window=window,
                        status=enrollment_statuses[i % len(enrollment_statuses)],
                        employee_contribution=plan.employee_contribution,
                        employer_contribution=plan.employer_contribution,
                    )
                )
        self.stdout.write("  ✓ Benefits plans, windows, enrollments")

    def _seed_contracts(self):
        from apps.employees.models import Employee
        from apps.contracts.models import Contract

        employees = list(Employee.objects.all())
        contract_types = ["Permanent", "Permanent", "Fixed-Term", "Permanent", "Contract", "Permanent", "Fixed-Term", "Permanent"]
        for i, emp in enumerate(employees):
            ct = contract_types[i % len(contract_types)]
            end = date(2027, 6, 30) if ct in ("Fixed-Term", "Contract") else None
            Contract.objects.get_or_create(
                employee=emp,
                defaults=dict(
                    contract_type=ct,
                    start_date=emp.date_joined or date(2020, 1, 1),
                    end_date=end,
                    status="Active",
                    gross_salary=emp.gross_salary,
                    job_title=emp.designation.title if emp.designation else "Staff",
                    department=emp.department.name if emp.department else "",
                )
            )
        self.stdout.write("  ✓ Contracts")
