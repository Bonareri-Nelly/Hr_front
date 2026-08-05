import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.authentication.models import User
from apps.employees.models import Employee, Branch, Department, Designation

def seed():
    # Create Branch
    branch, _ = Branch.objects.get_or_create(
        code='HQ',
        defaults={'name': 'Headquarters', 'location': 'Nairobi'}
    )
    
    # Create Department
    dept, _ = Department.objects.get_or_create(
        code='IT',
        defaults={'name': 'Information Technology', 'branch': branch}
    )
    
    # Create Designation
    desig, _ = Designation.objects.get_or_create(
        title='Software Engineer',
        defaults={'department': dept}
    )
    
    # Create Employee
    emp, created = Employee.objects.get_or_create(
        employee_number='EMP001',
        defaults={
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'branch': branch,
            'department': dept,
            'designation': desig,
            'employment_status': 'Active',
            'employment_type': 'Full-Time'
        }
    )
    
    # Create User
    user, created = User.objects.get_or_create(
        username='employee',
        defaults={
            'email': 'john.doe@example.com',
            'role': 'Employee',
            'employee_id': emp.id,
            'first_name': 'John',
            'last_name': 'Doe',
            'is_approved': True,
            'is_active': True
        }
    )
    if created or not user.check_password('password123'):
        user.set_password('password123')
        user.save()
        print("Employee user created/updated: employee / password123")
    else:
        print("Employee user already exists")

if __name__ == '__main__':
    seed()
