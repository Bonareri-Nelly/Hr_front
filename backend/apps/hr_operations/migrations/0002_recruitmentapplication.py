from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("hr_operations", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="RecruitmentApplication",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("reference", models.CharField(max_length=32, unique=True)),
                ("full_name", models.CharField(max_length=200)), ("email", models.EmailField(max_length=254)),
                ("phone", models.CharField(max_length=40)), ("role", models.CharField(max_length=200)),
                ("branch", models.CharField(blank=True, max_length=200)), ("experience", models.TextField(blank=True)),
                ("education", models.TextField(blank=True)), ("expected_salary", models.CharField(blank=True, max_length=100)),
                ("documents", models.JSONField(blank=True, default=list)),
                ("stage", models.CharField(choices=[("SUBMITTED", "Submitted"), ("UNDER_REVIEW", "Under review"), ("SHORTLISTED", "Shortlisted"), ("INTERVIEW_SCHEDULED", "Interview scheduled"), ("REJECTED", "Rejected")], default="SUBMITTED", max_length=32)),
                ("decision_note", models.TextField(blank=True)), ("submitted_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
