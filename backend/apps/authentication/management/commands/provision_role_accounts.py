"""Create the seven access accounts without creating employees, payroll or demo data."""
from django.core.management.base import BaseCommand
from apps.authentication.models import User


class Command(BaseCommand):
    help = "Provision the seven HRMS role accounts; no seed business data is created."

    def add_arguments(self, parser):
        parser.add_argument("--password", default="Pass1234", help="Initial password for accounts created by this command.")
        parser.add_argument("--reset-existing", action="store_true", help="Also reset the seven named role accounts to --password.")

    def handle(self, *args, **options):
        accounts = {
            "admin": "System Admin", "executive": "Executive", "branchmanager": "Manager",
            "hr": "HR", "employee": "Employee", "departmenthead": "Department Head", "finance": "Finance",
        }
        for username, role in accounts.items():
            user, created = User.objects.get_or_create(username=username, defaults={"role": role, "is_staff": role == "System Admin", "is_superuser": role == "System Admin"})
            if created:
                user.set_password(options["password"])
                user.save(update_fields=["password"])
                self.stdout.write(self.style.SUCCESS(f"Created {username} ({role})"))
            else:
                if options["reset_existing"]:
                    user.set_password(options["password"])
                    user.save(update_fields=["password"])
                    self.stdout.write(self.style.WARNING(f"Reset {username} ({user.role})"))
                    continue
                self.stdout.write(f"Kept existing {username} ({user.role})")
