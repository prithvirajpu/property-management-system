from django.contrib import admin
from apps.properties.models import Property

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "name",
        "location",
        "created_at",
    ]

    search_fields = [
        "name",
        "location",
        "address",
    ]

    list_filter = [
        "location",
        "created_at",
    ]