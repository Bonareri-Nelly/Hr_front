from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    dependencies = [("employees", "0001_initial"), ("hr_operations", "0004_alter_announcement_target_audience")]
    operations = [migrations.CreateModel(name="Complaint", fields=[
        ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
        ("category", models.CharField(max_length=100)), ("subject", models.CharField(max_length=300)), ("details", models.TextField()),
        ("preferred_resolution", models.CharField(blank=True, max_length=200)), ("confidentiality", models.CharField(default="Standard", max_length=100)),
        ("attachment", models.FileField(blank=True, null=True, upload_to="complaints/")),
        ("status", models.CharField(choices=[("Submitted", "Submitted"), ("Under Review", "Under Review"), ("Resolved", "Resolved"), ("Closed", "Closed")], default="Submitted", max_length=30)),
        ("resolution_notes", models.TextField(blank=True)), ("created_at", models.DateTimeField(auto_now_add=True)), ("updated_at", models.DateTimeField(auto_now=True)),
        ("employee", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="complaints", to="employees.employee")),
        ("reviewed_by", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="reviewed_complaints", to="employees.employee")),
    ])]
