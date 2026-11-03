import uuid
import cloudinary.uploader
import cloudinary.utils

from django.db import transaction
from django.conf import settings
from django.db.models import Q
from apps.tenants.models import Tenant,TenantDocument

def get_tenants(filters=None):
    filters=filters or {}
    tenants= Tenant.objects.all()
    search=filters.get('search')
    if search:
        tenants=tenants.filter(Q(full_name__icontains=search)|
                               Q(email__icontains=search) |
                               Q(phone__icontains=search))
    ordering=filters.get('ordering')
    allowed_ordering = [
        "full_name",
        "-full_name",
        "created_at",
        "-created_at",
    ]
    if ordering in allowed_ordering:
        tenants=tenants.order_by(ordering)
    return tenants

def get_tenant_by_id(tenant_id):
    return (Tenant.objects.filter(id=tenant_id).first())

@transaction.atomic
def create_tenant(validated_data):
    return Tenant.objects.create(**validated_data)

@transaction.atomic
def update_tenant(tenant_obj,validated_data):
    for k,v in validated_data.items():
        setattr(tenant_obj,k,v)
    tenant_obj.save()
    return tenant_obj

@transaction.atomic
def delete_tenant(tenant_obj):
    tenant_obj.delete()
    return True

def get_tenant_documents(tenant_id):
    return (TenantDocument.objects.filter(tenant_id=tenant_id).select_related('tenant'))

def get_document_by_id(document_id):
    return (TenantDocument.objects.select_related('tenant').filter(id=document_id).first())

@transaction.atomic
def create_tenant_document(validated_data):
    uploaded_file= validated_data.pop('document')
    public_id=f'tenant_documents/{uuid.uuid4().hex}'
    upload_result=cloudinary.uploader.upload(
        uploaded_file,resource_type='image',type='authenticated',
        public_id=public_id,overwrite=False,
    )
    try:
        # Store the Cloudinary public ID and format in FileField.
        # We are NOT saving the actual file to local storage.
        cloudinary_file_name = (
            f"{upload_result['public_id']}."
            f"{upload_result['format']}"
        )

        document = TenantDocument.objects.create(
            **validated_data,
            document=cloudinary_file_name,
        )

        return document

    except Exception:
        # Clean up Cloudinary if database creation fails.
        cloudinary.uploader.destroy(
            upload_result["public_id"],
            resource_type="image",
            type="authenticated",
        )
        raise

@transaction.atomic
def delete_tenant_document(document_obj):

    cloudinary_file_name = document_obj.document.name
    public_id = cloudinary_file_name.rsplit(".", 1)[0]

    cloudinary.uploader.destroy(
        public_id,
        resource_type="image",
        type="authenticated",
    )

    document_obj.delete()

    return True

def get_document_download_url(document_obj):

    cloudinary_file_name = document_obj.document.name

    public_id, file_format = cloudinary_file_name.rsplit(".", 1)

    download_url = cloudinary.utils.private_download_url(
        public_id,
        file_format,
        resource_type="image",
        type="authenticated",
        expires_at=int(__import__("time").time()) + 300
    )

    return download_url
