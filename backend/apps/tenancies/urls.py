from django.urls import path

from apps.tenancies.views import (
    TenancyListCreateAPIView,
    TenancyDetailAPIView,
)

urlpatterns = [
    path("", TenancyListCreateAPIView.as_view(), name="tenancy-list-create"),
    path("<int:tenancy_id>/", TenancyDetailAPIView.as_view(), name="tenancy-detail"),
]
