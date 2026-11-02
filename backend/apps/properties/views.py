from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.exceptions import NotFound
from apps.properties.serializers import PropertySerializer

from apps.properties.services import (
    get_properties,
    get_property_by_id,
    create_property,
    update_property,
    delete_property,
)

class PropertyListCreateAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):

        properties = get_properties(filters=request.query_params)
        serializer = PropertySerializer(
            properties,
            many=True
        )

        return Response({
            "success": True,
            "message": "Properties retrieved successfully.",
            "data": serializer.data,
            "errors": None,
        }, status=status.HTTP_200_OK)

    def post(self, request):

        serializer = PropertySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        property_obj = create_property(
            serializer.validated_data
        )

        response_serializer = PropertySerializer(property_obj)

        return Response({
            "success": True,
            "message": "Property created successfully.",
            "data": response_serializer.data,
            "errors": None,
        }, status=status.HTTP_201_CREATED)


class PropertyDetailAPIView(APIView):

    permission_classes = [IsAdminUser]

    def get_object(self, pk):

        property_obj = get_property_by_id(pk)

        if not property_obj:
            raise NotFound("Property not found.")

        return property_obj

    def get(self, request, pk):

        property_obj = self.get_object(pk)

        serializer = PropertySerializer(property_obj)

        return Response({
            "success": True,
            "message": "Property retrieved successfully.",
            "data": serializer.data,
            "errors": None,
        }, status=status.HTTP_200_OK)

    def put(self, request, pk):

        property_obj = self.get_object(pk)
        serializer = PropertySerializer(
            property_obj,
            data=request.data
        )
        serializer.is_valid(raise_exception=True)

        updated_property = update_property(
            property_obj,
            serializer.validated_data
        )
        response_serializer = PropertySerializer(updated_property)

        return Response({
            "success": True,
            "message": "Property updated successfully.",
            "data": response_serializer.data,
            "errors": None,
        }, status=status.HTTP_200_OK)

    def patch(self, request, pk):

        property_obj = self.get_object(pk)

        serializer = PropertySerializer(
            property_obj,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)

        updated_property = update_property(
            property_obj,
            serializer.validated_data
        )

        response_serializer = PropertySerializer(updated_property)

        return Response({
            "success": True,
            "message": "Property updated successfully.",
            "data": response_serializer.data,
            "errors": None,
        }, status=status.HTTP_200_OK)

    def delete(self, request, pk):

        property_obj = self.get_object(pk)
        delete_property(property_obj)

        return Response({
            "success": True,
            "message": "Property deleted successfully.",
            "data": None,
            "errors": None,
        }, status=status.HTTP_200_OK)
