from django.contrib import admin

from apps.tenancies.models import Tenancy


@admin.register(Tenancy)
class TenancyAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "tenant",
        "unit",
        "start_date",
        "end_date",
        "monthly_rent",
        "rent_due_day",
        "status",
    ]

    search_fields = [
        "tenant__full_name",
        "unit__unit_number",
        "unit__property__name",
    ]

    list_filter = [
        "status",
        "start_date",
        "end_date",
    ]