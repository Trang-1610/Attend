from django.db import models
from django.core.serializers.json import DjangoJSONEncoder
from accounts.models import Account
from helper.generate_random_code import generate_random_code

class AuditLog(models.Model):
    class Operation(models.TextChoices):
        CREATE = "C", "Create"
        READ = "R", "Read"
        UPDATE = "U", "Update"
        DELETE = "D", "Delete"

    log_id = models.BigAutoField(primary_key=True)
    log_code = models.UUIDField(default=generate_random_code, unique=True)
    operation = models.CharField(max_length=1, choices=Operation.choices)

    old_data = models.JSONField(encoder=DjangoJSONEncoder, null=True, blank=True)
    new_data = models.JSONField(encoder=DjangoJSONEncoder, null=True, blank=True)

    changed_by = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)

    ip_address = models.GenericIPAddressField(null=True, blank=True)  # thay CharField bằng chuẩn IP
    user_agent = models.TextField(null=True, blank=True)

    record_id = models.CharField(max_length=255, null=True, blank=True)
    entity_id = models.CharField(max_length=255, null=True, blank=True)
    entity_name = models.CharField(max_length=255)
    module_name = models.CharField(max_length=100, null=True, blank=True)

    action_description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "audit_logs"
        indexes = [
            models.Index(fields=["changed_by"]),
            models.Index(fields=["entity_name"]),
            models.Index(fields=["changed_at"]),
        ]
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"

    def __str__(self):
        return f"[{self.get_operation_display()}] {self.entity_name} by {self.changed_by}"

class LoginLog(models.Model):
    class Status(models.TextChoices):
        SUCCESS = "S", "Success"
        FAILED = "F", "Failed"

    login_id = models.BigAutoField(primary_key=True)
    login_code = models.UUIDField(default=generate_random_code, unique=True)
    account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=1, choices=Status.choices, default=Status.SUCCESS)

    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(null=True, blank=True)

    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    device_info = models.JSONField(encoder=DjangoJSONEncoder, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "login_logs"
        indexes = [
            models.Index(fields=["account"]),
            models.Index(fields=["status"]),
            models.Index(fields=["login_time"]),
        ]
        verbose_name = "Login Log"
        verbose_name_plural = "Login Logs"

    def __str__(self):
        return f"Login {self.get_status_display()} - {self.account} at {self.login_time}"