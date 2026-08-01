from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("hr_operations", "0003_announcement_recipients"),
    ]

    operations = [
        migrations.AlterField(
            model_name="announcement",
            name="target_audience",
            field=models.CharField(
                choices=[
                    ("All", "All"), ("HR", "HR"), ("Finance", "Finance"),
                    ("Managers", "Managers"), ("Department Heads", "Department Heads"),
                    ("Employees", "Employees"),
                ],
                default="All",
                max_length=20,
            ),
        ),
    ]
