from accounts.models import UserSession
from django.utils import timezone

class UpdateLastActiveMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            UserSession.objects.filter(refresh_token=refresh_token).update(last_active=timezone.now())
        return self.get_response(request)