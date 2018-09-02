from resource.models import NamedResource, models
from category.models import Category


class Activity(NamedResource):
    # TODO Decide what to do when category is deleted
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.FloatField()
    date = models.DateField(null=True, blank=True, default=None)

    class Meta:
        verbose_name_plural = 'Activities'
