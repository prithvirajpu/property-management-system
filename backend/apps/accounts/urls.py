from django.urls import path

from apps.accounts.views import (
    AdminLoginAPIView,
    AdminProfileAPIView,
    AdminLogoutAPIView)
from rest_framework_simplejwt.views import TokenRefreshView



urlpatterns = [
    path("login/", AdminLoginAPIView.as_view(), name="admin-login"),
    path("refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("profile/", AdminProfileAPIView.as_view(), name="admin-profile"),
    path("logout/", AdminLogoutAPIView.as_view(), name="admin-logout"),
]