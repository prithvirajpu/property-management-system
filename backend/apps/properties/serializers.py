from rest_framework import serializers
from apps.properties.models import Property

class PropertySerializer(serializers.ModelSerializer):

    features = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        allow_empty=True
    )

    class Meta:

        model = Property

        fields = [
            "id",
            "name",
            "address",
            "location",
            "description",
            "features",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]
