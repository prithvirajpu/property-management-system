from django.contrib import admin

from apps.tenants.models import Tenant, TenantDocument


class TenantDocumentInline(admin.TabularInline):
    model = TenantDocument
    extra = 1


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "full_name",
        "email",
        "phone",
        "created_at",
    ]

    search_fields = [
        "full_name",
        "email",
        "phone",
    ]

    inlines = [TenantDocumentInline]


@admin.register(TenantDocument)
class TenantDocumentAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "tenant",
        "document_type",
        "created_at",
    ]

    list_filter = [
        "document_type",
        "created_at",
    ]