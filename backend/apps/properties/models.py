from django.db import models


class Property(models.Model):

    name = models.CharField(max_length=150)
    address = models.TextField()
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    features = models.JSONField(
        default=list,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Property"
        verbose_name_plural = "Properties"