from django.urls import path

from apps.tenants.views import (
    TenantListCreateAPIView,
    TenantDetailAPIView,
    TenantDocumentListCreateAPIView,
    TenantDocumentDetailAPIView,
)


urlpatterns = [
    # Tenant CRUD
    path("",TenantListCreateAPIView.as_view(),name="tenant-list-create"),
    path("<int:pk>/",TenantDetailAPIView.as_view(),name="tenant-detail"),
    # Tenant documents
    path("<int:tenant_id>/documents/",TenantDocumentListCreateAPIView.as_view(),name="tenant-document-list-create"),
    path("documents/<int:pk>/",TenantDocumentDetailAPIView.as_view(),name="tenant-document-detail"),
]