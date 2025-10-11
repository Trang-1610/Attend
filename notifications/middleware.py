import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

User = get_user_model()

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token_list = query_string.get("token")

        scope["user"] = AnonymousUser()

        if token_list:
            token = token_list[0]
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                account_id = payload.get("user_id")
                if account_id:
                    user = await self.get_user(account_id)
                    scope["user"] = user
            except jwt.ExpiredSignatureError:
                print("Token expired")
            except jwt.InvalidTokenError:
                print("Invalid token")

        return await self.inner(scope, receive, send)

    @staticmethod
    @database_sync_to_async
    def get_user(account_id):
        try:
            return User.objects.get(account_id=account_id)
        except User.DoesNotExist:
            return AnonymousUser()