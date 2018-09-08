from resource.models import NamedResource, models
from django.dispatch import receiver
from django.utils import timezone


class Category(NamedResource):
    INCOME = 'income'
    EXPENSE = 'expense'

    ACTIVITY_TYPES = (
        (INCOME, 'Income'),
        (EXPENSE, 'Expense'),
    )

    activity_type = models.CharField(
        max_length=30,
        choices=ACTIVITY_TYPES,
        default=EXPENSE,
    )
    planned_amount = models.FloatField(
        default=0,
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name_plural = 'Categories'


class PlannedAmountHistory(models.Model):
    category = models.ForeignKey(Category,
                                 on_delete=models.CASCADE)
    month = models.IntegerField()
    year = models.IntegerField()
    amount = models.FloatField(
        default=0,
        null=True,
        blank=True,
    )

    def __str__(self):
        return '{} - {}/{}: {}'.format(
            str(self.category),
            self.year,
            self.month,
            self.amount
        )

    class Meta:
        verbose_name_plural = 'Planned Amount Histories'


@receiver(models.signals.post_save, sender=Category)
def refresh_history(sender, instance, **kwargs):
    now = timezone.now()
    year = now.year
    month = now.month

    PlannedAmountHistory.objects.update_or_create(
        year=year,
        month=month,
        category=instance,
        defaults={
            'amount': instance.planned_amount,
        },
    )
