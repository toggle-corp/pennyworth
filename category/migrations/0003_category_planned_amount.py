# Generated by Django 2.1 on 2018-08-31 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('category', '0002_auto_20180831_1131'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='planned_amount',
            field=models.FloatField(blank=True, default=0),
        ),
    ]
