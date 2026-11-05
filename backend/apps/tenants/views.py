from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.exceptions import NotFound

from apps.tenants.serializers import (
    TenantSerializer,TenantDocumentSerializer,)
from apps.tenants.services import (
    get_tenants,get_tenant_by_id,create_tenant,update_tenant,
    delete_tenant,get_tenant_documents,get_document_by_id,
    create_tenant_document,delete_tenant_document,get_document_download_url,
)
from config.pagination import StandardResultsSetPagination

class TenantListCreateAPIView(APIView):
    permission_classes= [IsAdminUser]
    
    def get(self,request):
        tenants=get_tenants(filters=request.query_params)
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(
            tenants,
            request,
            view=self
        )
        serializer=TenantSerializer(page,many=True)
        
        return paginator.get_paginated_response(serializer.data)
        
    def post(self,request):
        serializer=TenantSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        tenant=create_tenant(serializer.validated_data)
        response_serializer=TenantSerializer(tenant)
        
        return Response({
            "success": True,
            "message": "Tenant created successfully.",
            "data": response_serializer.data,
            "errors": None,
        }, status=status.HTTP_201_CREATED)
        
class TenantDetailAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self,pk):
        tenant=get_tenant_by_id(pk)
        if not tenant:
            raise NotFound('Tenant not found')
        return tenant
    
    def get(self,request,pk):
        tenant=self.get_object(pk)
        serializer=TenantSerializer(tenant)
        return Response({
            "success": True,
            "message": "Tenant retrieved successfully.",
            "data": serializer.data,
            "errors": None,
        }, status=status.HTTP_200_OK)
        
    def put(self,request,pk):
        tenant=self.get_object(pk)
        serializer=TenantSerializer(tenant,data=request.data)
        serializer.is_valid(raise_exception=True)
        
        updated_tenant=update_tenant(tenant,serializer.validated_data)
        response_serializer=TenantSerializer(updated_tenant)
        return Response({
            "success": True,
            "message": "Tenant updated successfully.",
            "data": response_serializer.data,
            "errors": None,
        }, status=status.HTTP_200_OK)
        
    def patch(self,request,pk):
        tenant=self.get_object(pk)
        serializer=TenantSerializer(tenant,data=request.data,partial=True)
        serializer.is_valid(raise_exception=True)
        
        updated_data=update_tenant(tenant,serializer.validated_data)
        response_data=TenantSerializer(updated_data)
        return Response({
            "success": True,
            "message": "Tenant updated successfully.",
            "data": response_data.data,
            "errors": None,
        }, status=status.HTTP_200_OK)
    
    def delete(self, request, pk):
        tenant = self.get_object(pk)
        deleted=delete_tenant(tenant)
        if not deleted:
            return Response({
                "success": False,
                "message": "Cannot delete tenant because tenancy records exist.",
                "data": None,
                "errors": None
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "success": True,
            "message": "Tenant deleted successfully.",
            "data": None,
            "errors": None,
        }, status=status.HTTP_200_OK)
        
class TenantDocumentListCreateAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, tenant_id):
        tenant = get_tenant_by_id(tenant_id)

        if not tenant:
            raise NotFound("Tenant not found.")

        documents = get_tenant_documents(tenant_id)

        serializer = TenantDocumentSerializer(
            documents,
            many=True
        )
        return Response({
            "success": True,
            "message": "Tenant documents retrieved successfully.",
            "data": serializer.data,
            "errors": None,
        }, status=status.HTTP_200_OK)

    def post(self, request, tenant_id):
        tenant = get_tenant_by_id(tenant_id)

        if not tenant:
            raise NotFound("Tenant not found.")

        serializer = TenantDocumentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        document = create_tenant_document({
            **serializer.validated_data,
            "tenant": tenant,
        })
        response_serializer = TenantDocumentSerializer(document)

        return Response({
            "success": True,
            "message": "Tenant document uploaded successfully.",
            "data": response_serializer.data,
            "errors": None,
        }, status=status.HTTP_201_CREATED)


class TenantDocumentDetailAPIView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request, pk):

        document = get_document_by_id(pk)

        if not document:
            raise NotFound("Tenant document not found.")

        download_url = get_document_download_url(document)

        return Response({
            "success": True,
            "message": "Document download link generated successfully.",
            "data": {
                "document_id": document.id,
                "tenant": document.tenant.full_name,
                "document_type": document.document_type,
                "download_url": download_url,
                "expires_in": 300,
            },
            "errors": None,
        }, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        document = get_document_by_id(pk)

        if not document:
            raise NotFound("Tenant document not found.")
        delete_tenant_document(document)

        return Response({
            "success": True,
            "message": "Tenant document deleted successfully.",
            "data": None,
            "errors": None,
        }, status=status.HTTP_200_OK)