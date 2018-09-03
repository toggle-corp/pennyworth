from resource.models import NamedResource, models


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
