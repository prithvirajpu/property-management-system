from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny,IsAuthenticated

from rest_framework_simplejwt.exceptions import TokenError

from apps.accounts.serializers import (AdminLoginSerializer,AdminProfileSerializer)
from apps.accounts.services import blacklist_refresh_token

class AdminLoginAPIView(APIView):
    permission_classes= [AllowAny]
    
    def post(self,request):
        serializer=AdminLoginSerializer(data=request.data,context={"request":request},)
        serializer.is_valid(raise_exception=True)
        
        user=serializer.validated_data['user']
        tokens=serializer.validated_data['tokens']
        return Response({
            'success':True,
            "message":'Login successful.',
            'data':{
                'user':{
                    'id':user.id,
                    'email':user.email,
                    'is_staff':user.is_staff,
                    'is_superuser':user.is_superuser,
                },
                "tokens":tokens,
            },
        },status=status.HTTP_200_OK)

class AdminProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = AdminProfileSerializer(request.user)
        return Response({
                "success": True,
                "message": "Profile retrieved successfully.",
                "data": serializer.data,
                "errors": None,
            },
            status=status.HTTP_200_OK)

class AdminLogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response({
                    "success": False,
                    "message": "Refresh token is required.",
                    "data": None,
                    "errors": {
                        "refresh": ["This field is required."]
                    },},
                status=status.HTTP_400_BAD_REQUEST,)

        try:
            blacklist_refresh_token(token=refresh_token,user=request.user)

        except (TokenError, ValueError):
            return Response({
                    "success": False,
                    "message": "Invalid or expired refresh token.",
                    "data": None,
                    "errors": None,
                },
                status=status.HTTP_400_BAD_REQUEST,)

        return Response({
                "success": True,
                "message": "Logout successful.",
                "data": None,
                "errors": None,
            },
            status=status.HTTP_200_OK,)
