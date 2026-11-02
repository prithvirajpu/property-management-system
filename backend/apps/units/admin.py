from django.contrib import admin
from apps.units.models import Unit


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "property",
        "unit_number",
        "unit_type",
        "monthly_rent",
        "floor",
        "created_at",
    ]

    search_fields = [
        "unit_number",
        "property__name",
    ]

    list_filter = [
        "unit_type",
        "floor",
        "property",
    ]