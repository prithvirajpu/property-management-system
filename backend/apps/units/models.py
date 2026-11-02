from django.db import models


class Unit(models.Model):

    UNIT_TYPE_CHOICES = [
        ("1BHK", "1 BHK"),
        ("2BHK", "2 BHK"),
        ("3BHK", "3 BHK"),
        ("4BHK", "4 BHK"),
    ]
    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="units"
    )
    unit_number = models.CharField(max_length=50)
    unit_type = models.CharField(
        max_length=10,
        choices=UNIT_TYPE_CHOICES
    )
    monthly_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    area = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Area in square feet"
    )
    floor = models.PositiveIntegerField()
    features = models.JSONField(
        default=list,
        blank=True
    )

    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.property.name} - {self.unit_number}"

    class Meta:
        ordering = ["property", "unit_number"]

        constraints = [
            models.UniqueConstraint(
                fields=["property", "unit_number"],
                name="unique_unit_number_per_property"
            )
        ]

        verbose_name = "Unit"
        verbose_name_plural = "Units"