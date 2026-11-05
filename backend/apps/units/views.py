from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.exceptions import NotFound

from apps.units.serializers import UnitSerializer

from apps.units.services import (
    get_units,get_unit_by_id,create_unit,
    update_unit,delete_unit,
)
from config.pagination import StandardResultsSetPagination

class UnitListCreateAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        units = get_units(filters=request.query_params)
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(
            units,request,view=self
        )
        serializer = UnitSerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)

    def post(self, request):

        serializer = UnitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        unit = create_unit(serializer.validated_data)

        response_serializer = UnitSerializer(unit)

        return Response({
            "success": True,
            "message": "Unit created successfully.",
            "data": response_serializer.data,
            "errors": None,
        }, status=status.HTTP_201_CREATED)

class UnitDetailAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, pk):

        unit = get_unit_by_id(pk)
        if not unit:
            raise NotFound("Unit not found.")

        return unit

    def get(self, request, pk):

        unit = self.get_object(pk)
        serializer = UnitSerializer(unit)

        return Response({
            "success": True,
            "message": "Unit retrieved successfully.",
            "data": serializer.data,
            "errors": None,
        }, status=status.HTTP_200_OK)

    def put(self, request, pk):
        unit = self.get_object(pk)
        serializer = UnitSerializer(unit, data=request.data)
        serializer.is_valid(raise_exception=True)

        updated_unit = update_unit(unit, serializer.validated_data)
        response_serializer = UnitSerializer(updated_unit)

        return Response({
            "success": True,
            "message": "Unit updated successfully.",
            "data": response_serializer.data,
            "errors": None,
        }, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        unit = self.get_object(pk)
        serializer = UnitSerializer(
            unit,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        updated_unit = update_unit(unit, serializer.validated_data)
        response_serializer = UnitSerializer(updated_unit)

        return Response({
            "success": True,
            "message": "Unit updated successfully.",
            "data": response_serializer.data,
            "errors": None,
        }, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        unit = self.get_object(pk)
        deleted=delete_unit(unit)
        if not deleted:
            return Response({
                "success": False,
                "message": "Cannot delete this unit because tenancy records exist.",
                "data": None,
                "errors": {
                    "unit": ["This unit is associated with a tenancy."]
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "success": True,
            "message": "Unit deleted successfully.",
            "data": None,
            "errors": None,
        }, status=status.HTTP_200_OK)