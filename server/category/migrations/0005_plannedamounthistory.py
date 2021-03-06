# Generated by Django 2.1 on 2018-09-08 09:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('category', '0004_auto_20180903_1643'),
    ]

    operations = [
        migrations.CreateModel(
            name='PlannedAmountHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('month', models.IntegerField()),
                ('year', models.IntegerField()),
                ('amount', models.FloatField()),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='category.Category')),
            ],
            options={
                'verbose_name_plural': 'Planned Amount Histories',
            },
        ),
    ]
