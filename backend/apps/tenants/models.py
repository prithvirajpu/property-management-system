from django.db import models


class Tenant(models.Model):

    full_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Tenant"
        verbose_name_plural = "Tenants"
        
class TenantDocument(models.Model):

    DOCUMENT_TYPE_CHOICES = [
        ("AADHAAR", "Aadhaar Card"),
        ("PAN", "PAN Card"),
        ("PASSPORT", "Passport"),
        ("DRIVING_LICENSE", "Driving License"),
        ("OTHER", "Other"),
    ]

    tenant = models.ForeignKey(Tenant,on_delete=models.CASCADE,related_name="documents")
    document_type = models.CharField(max_length=30,choices=DOCUMENT_TYPE_CHOICES)
    document = models.FileField(upload_to="tenant_documents/")

    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.tenant.full_name} - {self.document_type}"

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Tenant Document"
        verbose_name_plural = "Tenant Documents"