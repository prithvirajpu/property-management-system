
from rest_framework import serializers

from apps.tenancies.models import Tenancy


class TenancySerializer(serializers.ModelSerializer):

    tenant_name = serializers.CharField(
        source="tenant.full_name",
        read_only=True
    )

    unit_number = serializers.CharField(
        source="unit.unit_number",
        read_only=True
    )

    property_name = serializers.CharField(
        source="unit.property.name",
        read_only=True
    )

    class Meta:
        model = Tenancy
        fields = [
            "id",
            "tenant",
            "tenant_name",
            "unit",
            "unit_number",
            "property_name",
            "start_date",
            "end_date",
            "monthly_rent",
            "rent_due_day",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):

        start_date = attrs.get(
            "start_date",
            getattr(self.instance, "start_date", None)
        )

        end_date = attrs.get(
            "end_date",
            getattr(self.instance, "end_date", None)
        )

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                "end_date": "End date cannot be earlier than start date."
            })

        monthly_rent = attrs.get(
            "monthly_rent",
            getattr(self.instance, "monthly_rent", None)
        )

        if monthly_rent is not None and monthly_rent <= 0:
            raise serializers.ValidationError({
                "monthly_rent": "Monthly rent must be greater than zero."
            })

        rent_due_day = attrs.get(
            "rent_due_day",
            getattr(self.instance, "rent_due_day", None)
        )

        if rent_due_day is not None and not 1 <= rent_due_day <= 31:
            raise serializers.ValidationError({
                "rent_due_day": "Rent due day must be between 1 and 31."
            })

        return attrs
