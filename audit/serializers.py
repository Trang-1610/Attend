from rest_framework import serializers
from .models import LoginLog

# ==================================================
# Aduit login serializer
# ==================================================
class AuditLoginLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginLog
        fields = [
            'login_id', 'login_code', 'status', 
            'login_time', 'logout_time', 'ip_address', 
            'user_agent', 'device_info', 'created_at'
        ]