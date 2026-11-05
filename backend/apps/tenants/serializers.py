from pathlib import Path
from rest_framework import serializers
from apps.tenants.models import Tenant,TenantDocument

class TenantSerializer(serializers.ModelSerializer):
    
    class Meta:
        model= Tenant
        fields=[
            "id",
            "full_name",
            "email",
            "phone",
            "address",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

class TenantDocumentSerializer(serializers.ModelSerializer):

    tenant_name = serializers.CharField(
        source="tenant.full_name",
        read_only=True
    )

    tenant = serializers.PrimaryKeyRelatedField(read_only=True)

    document = serializers.FileField(write_only=True)

    class Meta:
        model = TenantDocument

        fields = [
            "id",
            "tenant",
            "tenant_name",
            "document_type",
            "document",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]

    def validate_document(self, value):

        allowed_extensions = [".pdf", ".jpg", ".jpeg", ".png"]

        extension = Path(value.name).suffix.lower()

        if extension not in allowed_extensions:
            raise serializers.ValidationError(
                "Only PDF, JPG, JPEG and PNG files are allowed."
            )

        max_size = 10 * 1024 * 1024

        if value.size > max_size:
            raise serializers.ValidationError(
                "File size cannot exceed 10 MB."
            )

        return value