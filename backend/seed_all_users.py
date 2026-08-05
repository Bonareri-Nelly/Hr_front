import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.authentication.models import User
from apps.employees.models import Employee, Branch, Department, Designation

def seed_all_users():
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
    
    # Define all users
    users_data = [
        {
            'username': 'admin',
            'password': 'password123',
            'email': 'admin@example.com',
            'role': 'System Admin',
            'first_name': 'Admin',
            'last_name': 'User',
        },
        {
            'username': 'executive',
            'password': 'password123',
            'email': 'executive@example.com',
            'role': 'Executive',
            'first_name': 'Executive',
            'last_name': 'Officer',
        },
        {
            'username': 'manager',
            'password': 'password123',
            'email': 'manager@example.com',
            'role': 'Manager',
            'first_name': 'Manager',
            'last_name': 'User',
        },
        {
            'username': 'hr',
            'password': 'password123',
            'email': 'hr@example.com',
            'role': 'HR',
            'first_name': 'HR',
            'last_name': 'Officer',
        },
        {
            'username': 'depthead',
            'password': 'password123',
            'email': 'depthead@example.com',
            'role': 'Department Head',
            'first_name': 'Department',
            'last_name': 'Head',
        },
        {
            'username': 'finance',
            'password': 'password123',
            'email': 'finance@example.com',
            'role': 'Finance',
            'first_name': 'Finance',
            'last_name': 'Officer',
        },
        {
            'username': 'employee',
            'password': 'password123',
            'email': 'employee@example.com',
            'role': 'Employee',
            'first_name': 'Regular',
            'last_name': 'Employee',
        },
    ]
    
    # Create or update users
    for user_data in users_data:
        username = user_data['username']
        password = user_data['password']
        
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': user_data['email'],
                'role': user_data['role'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'is_approved': True,
                'is_active': True,
            }
        )
        
        if created or not user.check_password(password):
            user.set_password(password)
            user.save()
            print(f"✓ Created/Updated user: {username} ({user_data['role']}) / {password}")
        else:
            print(f"✓ User already exists: {username} ({user_data['role']})")
        
        # Link employee role to an employee profile
        if user_data['role'] == 'Employee':
            emp, _ = Employee.objects.get_or_create(
                employee_number=f'EMP_{username.upper()}',
                defaults={
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                    'email': user_data['email'],
                    'branch': branch,
                    'department': dept,
                    'designation': desig,
                    'employment_status': 'Active',
                    'employment_type': 'Full-Time'
                }
            )
            user.employee_id = emp.id
            user.save()
            print(f"  └─ Linked to employee profile: {emp.id}")

if __name__ == '__main__':
    seed_all_users()
    print("\n✓ All users seeded successfully!")
