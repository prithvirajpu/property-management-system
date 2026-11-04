from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from apps.tenancies.serializers import TenancySerializer
from apps.tenancies import services
from config.pagination import StandardResultsSetPagination

class TenancyListCreateAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):

        filters = {
            "tenant": request.query_params.get("tenant"),
            "unit": request.query_params.get("unit"),
            "property": request.query_params.get("property"),
            "status": request.query_params.get("status"),
            "search": request.query_params.get("search"),
            "ordering": request.query_params.get("ordering"),
        }

        tenancies = services.get_tenancies(filters)
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(
            tenancies,request,view=self)
        serializer = TenancySerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        
        serializer = TenancySerializer(data=request.data)
        if serializer.is_valid():
            try:
                tenancy = services.create_tenancy(
                    serializer.validated_data
                )
                response_serializer = TenancySerializer(tenancy)

                return Response({
                    "success": True,
                    "message": "Tenancy created successfully.",
                    "data": response_serializer.data,
                    "errors": None,
                }, status=status.HTTP_201_CREATED)

            except ValidationError as error:

                return Response({
                    "success": False,
                    "message": "Tenancy creation failed.",
                    "data": None,
                    "errors": error.detail,
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            "success": False,
            "message": "Tenancy creation failed.",
            "data": None,
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)


class TenancyDetailAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, tenancy_id):

        return services.get_tenancy_by_id(tenancy_id)

    def get(self, request, tenancy_id):

        tenancy = self.get_object(tenancy_id)

        if not tenancy:
            return Response({
                "success": False,
                "message": "Tenancy not found.",
                "data": None,
                "errors": {"detail": "Invalid tenancy ID."},
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = TenancySerializer(tenancy)

        return Response({
            "success": True,
            "message": "Tenancy retrieved successfully.",
            "data": serializer.data,
            "errors": None,
        }, status=status.HTTP_200_OK)

    def put(self, request, tenancy_id):

        tenancy = self.get_object(tenancy_id)

        if not tenancy:
            return Response({
                "success": False,
                "message": "Tenancy not found.",
                "data": None,
                "errors": {"detail": "Invalid tenancy ID."},
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = TenancySerializer(
            tenancy,
            data=request.data
        )

        if serializer.is_valid():

            try:
                updated_tenancy = services.update_tenancy(
                    tenancy,
                    serializer.validated_data
                )
                response_serializer = TenancySerializer(updated_tenancy)

                return Response({
                    "success": True,
                    "message": "Tenancy updated successfully.",
                    "data": response_serializer.data,
                    "errors": None,
                }, status=status.HTTP_200_OK)

            except ValidationError as error:

                return Response({
                    "success": False,
                    "message": "Tenancy update failed.",
                    "data": None,
                    "errors": error.detail,
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "success": False,
            "message": "Tenancy update failed.",
            "data": None,
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, tenancy_id):

        tenancy = self.get_object(tenancy_id)

        if not tenancy:
            return Response({
                "success": False,
                "message": "Tenancy not found.",
                "data": None,
                "errors": {"detail": "Invalid tenancy ID."},
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = TenancySerializer(
            tenancy,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            try:
                updated_tenancy = services.update_tenancy(
                    tenancy,
                    serializer.validated_data
                )

                response_serializer = TenancySerializer(updated_tenancy)

                return Response({
                    "success": True,
                    "message": "Tenancy updated successfully.",
                    "data": response_serializer.data,
                    "errors": None,
                }, status=status.HTTP_200_OK)

            except ValidationError as error:

                return Response({
                    "success": False,
                    "message": "Tenancy update failed.",
                    "data": None,
                    "errors": error.detail,
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "success": False,
            "message": "Tenancy update failed.",
            "data": None,
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, tenancy_id):

        tenancy = self.get_object(tenancy_id)

        if not tenancy:
            return Response({
                "success": False,
                "message": "Tenancy not found.",
                "data": None,
                "errors": {"detail": "Invalid tenancy ID."},
            }, status=status.HTTP_404_NOT_FOUND)

        try:
            services.delete_tenancy(tenancy)
            
            return Response({
                "success": True,
                "message": "Tenancy deleted successfully.",
                "data": None,
                "errors": None,
            }, status=status.HTTP_200_OK)

        except ValidationError as error:

            return Response({
                "success": False,
                "message": 'Can not delete because of the relation exists',
                "data": None,
                "errors": error.detail,
            }, status=status.HTTP_400_BAD_REQUEST)
