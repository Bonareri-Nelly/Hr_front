from django.db import models


class Branch(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    location = models.CharField(max_length=300, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "branches"

    def __str__(self):
        return self.name


class Department(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name="departments")
    head = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Designation(models.Model):
    title = models.CharField(max_length=200)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name="designations")
    grade = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


EMPLOYMENT_STATUS = [
    ("Active", "Active"), ("On Leave", "On Leave"),
    ("Suspended", "Suspended"), ("Terminated", "Terminated"), ("Resigned", "Resigned"),
]
EMPLOYMENT_TYPE = [
    ("Full-Time", "Full-Time"), ("Part-Time", "Part-Time"),
    ("Contract", "Contract"), ("Intern", "Intern"),
]
GENDER_CHOICES = [("Male", "Male"), ("Female", "Female"), ("Other", "Other")]


class Employee(models.Model):
    employee_number = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30, blank=True)
    national_id = models.CharField(max_length=50, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    date_joined = models.DateField(null=True, blank=True)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name="employees")
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name="employees")
    designation = models.ForeignKey(Designation, on_delete=models.SET_NULL, null=True, blank=True, related_name="employees")
    manager = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True, related_name="direct_reports")
    employment_status = models.CharField(max_length=20, choices=EMPLOYMENT_STATUS, default="Active")
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE, default="Full-Time")
    gross_salary = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    photo = models.ImageField(upload_to="employees/photos/", null=True, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.employee_number})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def branch_name(self):
        return self.branch.name if self.branch else ""

    @property
    def department_name(self):
        return self.department.name if self.department else ""

    @property
    def designation_title(self):
        return self.designation.title if self.designation else ""


class Document(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="documents")
    document_type = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to="documents/", null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} – {self.employee}"


class Education(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="education")
    institution = models.CharField(max_length=200)
    qualification = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=200, blank=True)
    start_year = models.PositiveIntegerField(null=True, blank=True)
    end_year = models.PositiveIntegerField(null=True, blank=True)
    grade = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class WorkExperience(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="work_experience")
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    responsibilities = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Dependant(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="dependants")
    name = models.CharField(max_length=200)
    relationship = models.CharField(max_length=50)
    date_of_birth = models.DateField(null=True, blank=True)
    national_id = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Certification(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="certifications")
    name = models.CharField(max_length=200)
    issuer = models.CharField(max_length=200, blank=True)
    issue_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    credential_id = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Skill(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="skills")
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class BankAccount(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="bank_accounts")
    bank_name = models.CharField(max_length=200)
    account_number = models.CharField(max_length=50)
    account_name = models.CharField(max_length=200)
    branch = models.CharField(max_length=200, blank=True)
    swift_code = models.CharField(max_length=20, blank=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Asset(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="assets")
    asset_type = models.CharField(max_length=100)
    asset_name = models.CharField(max_length=200)
    serial_number = models.CharField(max_length=100, blank=True)
    assigned_date = models.DateField(null=True, blank=True)
    return_date = models.DateField(null=True, blank=True)
    condition = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
