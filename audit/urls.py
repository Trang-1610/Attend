from django.urls import path
from .views import AuditLoginLogView

urlpatterns = [
    path('login-logs/<int:account_id>/', AuditLoginLogView.as_view(), name='audit-login-logs'),
]