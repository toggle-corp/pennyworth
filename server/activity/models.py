from resource.models import KeyBasedModel, NamedResource, models
from category.models import Category


class Activity(NamedResource):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.FloatField()
    date = models.DateField(null=True, blank=True, default=None)

    class Meta:
        verbose_name_plural = 'Activities'


class ActivityFile(KeyBasedModel):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    file = models.FileField(upload_to='activity_files/', max_length=255)

    def __str__(self):
        return '{} - {}'.format(self.activity, self.file)
