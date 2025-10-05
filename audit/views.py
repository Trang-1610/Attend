from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import AuditLoginLogSerializer
from .models import LoginLog
from rest_framework.response import Response

# ==================================================
# Aduit login log view
# ==================================================
class AuditLoginLogView(APIView):
    def get(self, request, account_id, format=None):
        login_logs = LoginLog.objects.filter(account_id=account_id)
        serializer = AuditLoginLogSerializer(login_logs, many=True)
        return Response(serializer.data)