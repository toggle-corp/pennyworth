# Generated by Django 2.1 on 2018-09-08 09:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('activity', '0002_auto_20180831_1131'),
    ]

    operations = [
        migrations.CreateModel(
            name='ActivityFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(max_length=255, upload_to='activity_files/')),
                ('activity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activity.Activity')),
            ],
        ),
    ]
