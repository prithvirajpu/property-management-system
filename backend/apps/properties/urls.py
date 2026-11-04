from django.urls import path

from apps.properties.views import (
    PropertyListCreateAPIView,
    PropertyDetailAPIView,DashboardSummaryAPIView,
)


urlpatterns = [

    path("",PropertyListCreateAPIView.as_view(),name="property-list-create"),
    path("<int:pk>/",PropertyDetailAPIView.as_view(),name="property-detail"),
    # dashboard
    path("summary/",DashboardSummaryAPIView.as_view(),name="dashboard-summary"),
    
]