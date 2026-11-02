from rest_framework import serializers

from apps.units.models import Unit
from apps.properties.models import Property


class UnitSerializer(serializers.ModelSerializer):

    property_name = serializers.CharField(
        source="property.name",
        read_only=True
    )

    features = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        allow_empty=True
    )

    class Meta:
        model = Unit

        fields = [
            "id",
            "property",
            "property_name",
            "unit_number",
            "unit_type",
            "monthly_rent",
            "area",
            "floor",
            "features",
            "description",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_property(self, value):
        if not Property.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Property does not exist.")

        return value