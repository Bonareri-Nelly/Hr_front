from django.db import models
from apps.employees.models import Employee


REVIEW_STATUS = [
    ("Draft", "Draft"), ("Submitted", "Submitted"),
    ("Manager Approved", "Manager Approved"), ("HR Approved", "HR Approved"),
    ("Finalized", "Finalized"), ("Completed", "Completed"),
]


class PerformanceCycle(models.Model):
    name = models.CharField(max_length=200)
    period_start = models.DateField()
    period_end = models.DateField()
    status = models.CharField(max_length=30, default="Active")
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class PerformanceGoal(models.Model):
    GOAL_STATUS = [
        ("Not Started", "Not Started"), ("In Progress", "In Progress"),
        ("Completed", "Completed"), ("Cancelled", "Cancelled"),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="performance_goals")
    cycle = models.ForeignKey(PerformanceCycle, on_delete=models.CASCADE, null=True, blank=True, related_name="goals")
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    target_date = models.DateField(null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=1)
    progress = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=GOAL_STATUS, default="Not Started")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def employee_name(self):
        return self.employee.full_name

    @property
    def cycle_name(self):
        return self.cycle.name if self.cycle else ""


class PerformanceReview(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="performance_reviews")
    cycle = models.ForeignKey(PerformanceCycle, on_delete=models.CASCADE, null=True, blank=True, related_name="reviews")
    reviewer = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="reviews_given")
    review_period_start = models.DateField(null=True, blank=True)
    review_period_end = models.DateField(null=True, blank=True)
    overall_rating = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=30, choices=REVIEW_STATUS, default="Draft")
    employee_comments = models.TextField(blank=True)
    manager_comments = models.TextField(blank=True)
    hr_comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def employee_name(self):
        return self.employee.full_name

    @property
    def cycle_name(self):
        return self.cycle.name if self.cycle else ""


class GoalProgress(models.Model):
    goal = models.ForeignKey(PerformanceGoal, on_delete=models.CASCADE, related_name="progress_logs")
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="goal_progress")
    progress_percent = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    @property
    def employee_name(self):
        return self.employee.full_name
