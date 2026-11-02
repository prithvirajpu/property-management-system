
from django.db import transaction
from django.db.models import Q

from apps.properties.models import Property


def get_properties(filters=None):
    
    filters = filters or {}
    properties = Property.objects.all()
    search = filters.get("search")

    if search:
        properties = properties.filter(
            Q(name__icontains=search) |
            Q(location__icontains=search) |
            Q(address__icontains=search)
        )

    location = filters.get("location")

    if location:
        properties = properties.filter(
            location__iexact=location
        )

    ordering = filters.get("ordering")

    allowed_ordering = [
        "name",
        "-name",
        "location",
        "-location",
        "created_at",
        "-created_at",
    ]

    if ordering in allowed_ordering:
        properties = properties.order_by(ordering)

    return properties


def get_property_by_id(property_id):

    return Property.objects.filter(
        id=property_id
    ).first()


@transaction.atomic
def create_property(validated_data):

    return Property.objects.create(**validated_data)


@transaction.atomic
def update_property(property_obj, validated_data):

    for field, value in validated_data.items():
        setattr(property_obj, field, value)

    property_obj.save()

    return property_obj


@transaction.atomic
def delete_property(property_obj):
    property_obj.delete()

    return True
