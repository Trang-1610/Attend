from urllib.parse import parse_qs
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from accounts.models import Account

@database_sync_to_async
def get_user(token_key):
    try:
        token = AccessToken(token_key)
        user = Account.objects.get(account_id=token["user_id"])
        return user
    except Exception:
        return AnonymousUser()

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Get token from cookie or query string parameter
        query_string = parse_qs(scope["query_string"].decode())
        token = None

        # Token priority in cookies
        headers = dict(scope["headers"])
        cookies_header = headers.get(b"cookie", b"").decode()
        cookies = dict(cookie.split("=", 1) for cookie in cookies_header.split("; ") if "=" in cookie)
        token = cookies.get("access_token") or query_string.get("token", [None])[0]

        if token:
            scope["user"] = await get_user(token)
        else:
            scope["user"] = AnonymousUser()

        return await self.inner(scope, receive, send)