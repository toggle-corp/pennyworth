from django.contrib import admin
from activity.models import Activity, ActivityFile


class ActivityFileInline(admin.TabularInline):
    model = ActivityFile
    extra = 0


class ActivityAdmin(admin.ModelAdmin):
    inlines = [ActivityFileInline]


admin.site.register(Activity, ActivityAdmin)
