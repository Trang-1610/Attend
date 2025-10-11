from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import AuditLoginLogSerializer, LoginLogAdminSerializer, AuditLogAdminSerializer
from .models import LoginLog, AuditLog
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from accounts.models import Account

# ==================================================
# Aduit login log view
# ==================================================
class AuditLoginLogView(APIView):
    def get(self, request, account_id, format=None):
        login_logs = LoginLog.objects.filter(account_id=account_id)
        serializer = AuditLoginLogSerializer(login_logs, many=True)
        return Response(serializer.data)
# ==================================================
# Aduit login log serializer for admin and superadmin
# ==================================================
class AuditLoginLogAdminView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    def get(self, request, format=None):
        login_logs = LoginLog.objects.select_related('account').all().order_by('-created_at')
        serializer = LoginLogAdminSerializer(login_logs, many=True)
        return Response(serializer.data)
# ==================================================
# Aduit login serializer for admin and superadmin
# ==================================================
class AuditLogAdminView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    def get(self, request, format=None):
        audit_logs = AuditLog.objects.select_related('changed_by').all().order_by('-created_at')
        serializer = AuditLogAdminSerializer(audit_logs, many=True)
        return Response(serializer.data)