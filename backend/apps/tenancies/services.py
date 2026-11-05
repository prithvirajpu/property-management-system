from django.db import transaction,IntegrityError
from django.db.models import Q

from rest_framework.exceptions import ValidationError
from apps.tenancies.models import Tenancy


def get_tenancies(filters=None):
    filters = filters or {}

    queryset = Tenancy.objects.select_related(
        "tenant",
        "unit",
        "unit__property"
    )

    if filters.get("tenant"):
        queryset = queryset.filter(
            tenant_id=filters["tenant"]
        )

    if filters.get("unit"):
        queryset = queryset.filter(
            unit_id=filters["unit"]
        )

    if filters.get("property"):
        queryset = queryset.filter(
            unit__property_id=filters["property"]
        )

    if filters.get("status"):
        queryset = queryset.filter(
            status=filters["status"]
        )

    if filters.get("search"):
        search = filters["search"]

        queryset = queryset.filter(
            Q(tenant__full_name__icontains=search)
            | Q(unit__unit_number__icontains=search)
            | Q(unit__property__name__icontains=search)
        )

    if filters.get("ordering"):
        queryset = queryset.order_by(filters["ordering"])

    return queryset


def get_tenancy_by_id(tenancy_id):
    return Tenancy.objects.select_related(
        "tenant",
        "unit",
        "unit__property"
    ).filter(id=tenancy_id).first()


def validate_unit_availability(unit_id, exclude_id=None):

    queryset = Tenancy.objects.filter(
        unit_id=unit_id,
        status="ACTIVE"
    )

    if exclude_id:
        queryset = queryset.exclude(id=exclude_id)

    if queryset.exists():
        raise ValidationError({
            "unit": "This unit is already occupied by another tenant."
        })


@transaction.atomic
def create_tenancy(validated_data):

    unit = validated_data["unit"]
    status = validated_data.get("status", "ACTIVE")

    if status == "ACTIVE":
        validate_unit_availability(unit.id)

    try:
        tenancy = Tenancy.objects.create(**validated_data)
        return tenancy

    except IntegrityError:
        raise ValidationError({
            "unit": "This unit is already occupied by another tenant."
        })


@transaction.atomic
def update_tenancy(tenancy, validated_data):

    unit = validated_data.get("unit", tenancy.unit)
    start_date = validated_data.get("start_date", tenancy.start_date)
    end_date = validated_data.get("end_date", tenancy.end_date)

    validate_unit_availability(
        unit_id=unit.id,
        start_date=start_date,
        end_date=end_date,
        exclude_id=tenancy.id
    )

    for field, value in validated_data.items():
        setattr(tenancy, field, value)

    tenancy.save()

    return tenancy


def delete_tenancy(tenancy):

    if tenancy.status == "ACTIVE":
        raise ValidationError({
            "status": "An active tenancy cannot be deleted. Terminate or complete it first."
        })
    

    tenancy.delete()
