from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError


def authenticate_admin(email, password, request=None):
    user = authenticate(
        request=request,
        email=email,
        password=password,
    )

    if not user:
        return None

    if not user.is_active:
        return None

    if not (user.is_staff or user.is_superuser):
        return None

    return user


def generate_tokens(user):
    refresh = RefreshToken.for_user(user)

    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


def blacklist_refresh_token(token, user):
    refresh = RefreshToken(token)

    token_user_id = refresh.get("user_id")

    if str(token_user_id) != str(user.pk):
        raise ValueError("Invalid refresh token.")

    refresh.blacklist()