from rest_framework import serializers

from apps.accounts.services import (
    authenticate_admin,
    generate_tokens,
)


class AdminLoginSerializer(serializers.Serializer):

    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    def validate(self, attrs):

        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate_admin(
            email=email,
            password=password,
            request=self.context.get("request"),
        )

        if not user:
            raise serializers.ValidationError({
                "detail": "Invalid email or password, or account is not authorized."
            })

        tokens = generate_tokens(user)

        return {
            "user": user,
            "tokens": tokens,
        }


class AdminProfileSerializer(serializers.Serializer):

    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)