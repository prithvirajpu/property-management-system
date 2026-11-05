from django.urls import path

from apps.units.views import (
    UnitListCreateAPIView,
    UnitDetailAPIView,
)


urlpatterns = [
    path("", UnitListCreateAPIView.as_view(), name="unit-list-create"),
    path("<int:pk>/", UnitDetailAPIView.as_view(), name="unit-detail"),
]