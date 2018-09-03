import string
import random

from category.models import Category


def random_key(length=16):
    candidates = string.ascii_lowercase + string.digits
    winners = [random.choice(candidates) for _ in range(length)]
    return ''.join(winners)


default_categories = [
    {
        'title': 'Income',
        'activity_type': Category.INCOME,
    },
    {
        'title': 'Food',
        'activity_type': Category.EXPENSE,
    },
    {
        'title': 'Transportation',
        'activity_type': Category.EXPENSE,
    },
    {
        'title': 'Health',
        'activity_type': Category.EXPENSE,
    },
    {
        'title': 'Miscellaneous',
        'activity_type': Category.EXPENSE,
    },
]


def create_categories_for(user):
    for cat in default_categories:
        Category.objects.create(
            **cat,
            key=random_key(),
            user=user,
        )
