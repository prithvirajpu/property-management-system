from django.db import transaction
from django.db.models import Q

from apps.units.models import Unit
from apps.tenancies.models import Tenancy


def get_units(filters=None):
    filters = filters or {}

    units = Unit.objects.select_related("property").all()

    # Search by unit number or property name
    search = filters.get("search")

    if search:
        units = units.filter(
            Q(unit_number__icontains=search) |
            Q(property__name__icontains=search)
        )

    # Filter by property
    property_id = filters.get("property")

    if property_id:
        units = units.filter(property_id=property_id)

    # Filter by unit type
    unit_type = filters.get("unit_type")

    if unit_type:
        units = units.filter(unit_type=unit_type)

    # Filter by floor
    floor = filters.get("floor")

    if floor:
        units = units.filter(floor=floor)

    # Filter by minimum rent
    min_rent = filters.get("min_rent")

    if min_rent:
        units = units.filter(monthly_rent__gte=min_rent)

    # Filter by maximum rent
    max_rent = filters.get("max_rent")

    if max_rent:
        units = units.filter(monthly_rent__lte=max_rent)

    # Ordering
    ordering = filters.get("ordering")

    allowed_ordering = [
        "unit_number",
        "-unit_number",
        "monthly_rent",
        "-monthly_rent",
        "floor",
        "-floor",
        "created_at",
        "-created_at",
    ]

    if ordering in allowed_ordering:
        units = units.order_by(ordering)

    return units


def get_unit_by_id(unit_id):
    return (
        Unit.objects
        .select_related("property")
        .filter(id=unit_id)
        .first()
    )


@transaction.atomic
def create_unit(validated_data):
    return Unit.objects.create(**validated_data)


@transaction.atomic
def update_unit(unit_obj, validated_data):
    for field, value in validated_data.items():
        setattr(unit_obj, field, value)

    unit_obj.save()

    return unit_obj


@transaction.atomic
def delete_unit(unit_obj):
    if Tenancy.objects.filter(unit=unit_obj).exists():
        return False
    unit_obj.delete()

    return True