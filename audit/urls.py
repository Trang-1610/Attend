from django.urls import path
from .views import AuditLoginLogView, AuditLoginLogAdminView, AuditLogAdminView

urlpatterns = [
    path('login-logs/<int:account_id>/', AuditLoginLogView.as_view(), name='audit-login-logs'),
    # Get all login logs
    path('admin/login-logs/all/', AuditLoginLogAdminView.as_view(), name='audit-login-logs-admin'),
    # Get all audit logs
    path('admin/audit-logs/all/', AuditLogAdminView.as_view(), name='audit-logs-admin'),
]