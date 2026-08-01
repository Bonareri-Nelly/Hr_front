from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("employees", "0001_initial"),
        ("hr_operations", "0002_recruitmentapplication"),
    ]

    operations = [
        migrations.AddField(
            model_name="announcement",
            name="target_branch",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="announcements", to="employees.branch"),
        ),
        migrations.AddField(
            model_name="announcement",
            name="target_employee",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="received_announcements", to="employees.employee"),
        ),
    ]
