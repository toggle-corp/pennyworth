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
