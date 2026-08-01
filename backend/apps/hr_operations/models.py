from django.db import models
from apps.employees.models import Employee


class HrPerformanceReview(models.Model):
    STATUS = [
        ("Draft", "Draft"), ("Submitted", "Submitted"),
        ("Manager Approved", "Manager Approved"), ("Finalized", "Finalized"),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="hr_reviews")
    reviewer = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="hr_reviews_given")
    review_period = models.CharField(max_length=50)
    rating = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS, default="Draft")
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def employee_name(self):
        return self.employee.full_name


class HrPerformanceGoal(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="hr_goals")
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    target_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, default="In Progress")
    progress = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def employee_name(self):
        return self.employee.full_name


class DisciplinaryCase(models.Model):
    SEVERITY = [("Minor", "Minor"), ("Moderate", "Moderate"), ("Severe", "Severe")]
    STATUS = [("Open", "Open"), ("Under Review", "Under Review"), ("Resolved", "Resolved"), ("Closed", "Closed")]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="disciplinary_cases")
    case_number = models.CharField(max_length=50, unique=True)
    incident_date = models.DateField()
    severity = models.CharField(max_length=20, choices=SEVERITY, default="Minor")
    description = models.TextField()
    action_taken = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default="Open")
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="resolved_cases")
    resolution_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def employee_name(self):
        return self.employee.full_name


class Announcement(models.Model):
    PRIORITY = [("Low", "Low"), ("Normal", "Normal"), ("High", "High"), ("Urgent", "Urgent")]
    TARGET = [("All", "All"), ("HR", "HR"), ("Finance", "Finance"), ("Managers", "Managers"), ("Department Heads", "Department Heads"), ("Employees", "Employees")]
    title = models.CharField(max_length=300)
    content = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY, default="Normal")
    target_audience = models.CharField(max_length=20, choices=TARGET, default="All")
    target_branch = models.ForeignKey("employees.Branch", on_delete=models.SET_NULL, null=True, blank=True, related_name="announcements")
    target_employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="received_announcements")
    published_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    author = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="announcements")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Training(models.Model):
    STATUS = [("Upcoming", "Upcoming"), ("Ongoing", "Ongoing"), ("Completed", "Completed"), ("Cancelled", "Cancelled")]
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    trainer = models.CharField(max_length=200, blank=True)
    venue = models.CharField(max_length=300, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    max_participants = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default="Upcoming")
    is_mandatory = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class TrainingEnrollment(models.Model):
    STATUS = [("Enrolled", "Enrolled"), ("Completed", "Completed"), ("Withdrawn", "Withdrawn")]
    training = models.ForeignKey(Training, on_delete=models.CASCADE, related_name="enrollments")
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="training_enrollments")
    status = models.CharField(max_length=20, choices=STATUS, default="Enrolled")
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    feedback = models.TextField(blank=True)

    class Meta:
        unique_together = [["training", "employee"]]

    @property
    def employee_name(self):
        return self.employee.full_name

    @property
    def training_title(self):
        return self.training.title


class RecruitmentApplication(models.Model):
    STAGES = [
        ("SUBMITTED", "Submitted"), ("UNDER_REVIEW", "Under review"),
        ("SHORTLISTED", "Shortlisted"), ("INTERVIEW_SCHEDULED", "Interview scheduled"),
        ("REJECTED", "Rejected"),
    ]
    reference = models.CharField(max_length=32, unique=True)
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=40)
    role = models.CharField(max_length=200)
    branch = models.CharField(max_length=200, blank=True)
    experience = models.TextField(blank=True)
    education = models.TextField(blank=True)
    expected_salary = models.CharField(max_length=100, blank=True)
    documents = models.JSONField(default=list, blank=True)
    stage = models.CharField(max_length=32, choices=STAGES, default="SUBMITTED")
    decision_note = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.reference} — {self.full_name}"


class Complaint(models.Model):
    STATUS = [("Submitted", "Submitted"), ("Under Review", "Under Review"), ("Resolved", "Resolved"), ("Closed", "Closed")]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="complaints")
    category = models.CharField(max_length=100)
    subject = models.CharField(max_length=300)
    details = models.TextField()
    preferred_resolution = models.CharField(max_length=200, blank=True)
    confidentiality = models.CharField(max_length=100, default="Standard")
    attachment = models.FileField(upload_to="complaints/", null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS, default="Submitted")
    resolution_notes = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="reviewed_complaints")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def employee_name(self):
        return self.employee.full_name
