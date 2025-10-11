from rest_framework import serializers
from .models import LoginLog, AuditLog

# ==================================================
# Aduit login serializer for student and lecturer
# ==================================================
class AuditLoginLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginLog
        fields = [
            'login_id', 'login_code', 'status', 
            'login_time', 'logout_time', 'ip_address', 
            'user_agent', 'device_info', 'created_at'
        ]
# ==================================================
# Aduit login serializer for admin and superadmin
# ==================================================
class AuditLogAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
# ==================================================
# Login log serializer for admin and superadmin
# ==================================================
class LoginLogAdminSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()
    class Meta:
        model = LoginLog
        fields = [
            'login_id', 'login_code', 'status', 
            'login_time', 'logout_time', 'ip_address', 
            'user_agent', 'device_info', 'email', 'account'
        ]
    
    def get_email(self, obj):
        return obj.account.email if obj.account else None
    
    def get_account_id(self, obj):
        return obj.account.account_id if obj.account else None