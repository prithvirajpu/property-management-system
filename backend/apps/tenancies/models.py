from django.db import models
from django.db.models import Q


class Tenancy(models.Model):

    STATUS_CHOICES = [
        ("ACTIVE", "Active"),
        ("COMPLETED", "Completed"),
        ("TERMINATED", "Terminated"),
    ]

    tenant = models.ForeignKey(
        "tenants.Tenant",
        on_delete=models.PROTECT,
        related_name="tenancies"
    )

    unit = models.ForeignKey(
        "units.Unit",
        on_delete=models.PROTECT,
        related_name="tenancies"
    )
    start_date = models.DateField()
    end_date = models.DateField()

    monthly_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    rent_due_day = models.PositiveSmallIntegerField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.tenant.full_name} - {self.unit.unit_number}"

    class Meta:

        ordering = ["-created_at"]

        constraints = [
            models.CheckConstraint(
                condition=Q(end_date__gte=models.F("start_date")),
                name="valid_tenancy_date_range"
            ),

            models.CheckConstraint(
                condition=Q(rent_due_day__gte=1) &
                          Q(rent_due_day__lte=31),
                name="valid_rent_due_day"
            ),

            models.CheckConstraint(
                condition=Q(monthly_rent__gt=0),
                name="positive_monthly_rent"
            ),

            models.UniqueConstraint(
                fields=["unit"],
                condition=Q(status="ACTIVE"),
                name="unique_active_tenancy_per_unit"
            ),
        ]

        verbose_name = "Tenancy"
        verbose_name_plural = "Tenancies"