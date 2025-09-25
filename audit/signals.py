import json
from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver
from django.forms.models import model_to_dict
from django.utils.timezone import now
from leaves.models import LeaveRequest
from .models import AuditLog
from accounts.models import Account 
from decimal import Decimal
from django.db.models import FileField
from .utils import get_current_user, get_current_request, safe_model_to_dict
from helper.get_client_ip import get_client_ip
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from .models import LoginLog
from lecturers.models import Lecturer
from attend3d.middleware.thread_local import get_current_request
from accounts.utils.serializers import serialize_instance
from helper.get_client_ip import get_request_info
from lecturers.models import LecturerSubject, SubjectClass
from notifications.models import Reminder
import datetime
import decimal
import uuid
from django.db.models.fields.files import FieldFile

_old_instance_cache = {}
_PREVIOUS_STATE = {}

# ==================================================
# Write audit logs for LeaveRequest model when updated
# ==================================================
@receiver(pre_save, sender=LeaveRequest)
def before_leave_request_update(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = LeaveRequest.objects.get(pk=instance.pk)
            _old_instance_cache[instance.pk] = safe_model_to_dict(old_instance)
        except LeaveRequest.DoesNotExist:
            _old_instance_cache[instance.pk] = {}

# ==================================================
# Write audit logs for LeaveRequest model when saved
# ==================================================
@receiver(post_save, sender=LeaveRequest)
def after_leave_request_save(sender, instance, created, **kwargs):
    old_data = {}
    new_data = safe_model_to_dict(instance)

    operation = "C" if created else "U"
    if not created:
        old_data = _old_instance_cache.pop(instance.pk, {})

    user = get_current_user()
    request = get_current_request()

    AuditLog.objects.create(
        operation=operation,
        old_data=old_data,
        new_data=new_data,
        changed_by=user if user else Account.objects.first(),
        ip_address=request.META.get("REMOTE_ADDR") if request else "unknown",
        user_agent=request.META.get("HTTP_USER_AGENT") if request else "unknown",
        record_id=str(instance.pk),
        entity_id="leave_request",
        entity_name="LeaveRequest",
        action_description="Created leave request" if created else "Updated leave request",
    )

# ==================================================
# Log successful login
# ==================================================
@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    try:
        LoginLog.objects.create(
            account=user if isinstance(user, Account) else None,
            status=LoginLog.Status.SUCCESS,
            ip_address=get_client_ip(request),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            device_info={
                "path": request.path,
                "method": request.method,
                "is_secure": request.is_secure(),
                "remote_host": request.META.get("REMOTE_HOST", ""),
            },
        )
    except Exception as e:
        logger.error(f"Failed to log user login: {e}")


# ==================================================
# Log failed login
# ==================================================
@receiver(user_login_failed)
def log_user_login_failed(sender, credentials, request, **kwargs):
    try:
        LoginLog.objects.create(
            account=None,  # no account associated with failed login
            status=LoginLog.Status.FAILED,
            ip_address=get_client_ip(request) if request else None,
            user_agent=request.META.get("HTTP_USER_AGENT", "") if request else None,
            device_info={
                "username": credentials.get("username") if credentials else None,
                "path": request.path if request else None,
                "method": request.method if request else None,
            },
        )
    except Exception as e:
        logger.error(f"Failed to log user login failed: {e}")


# ==================================================
# Log logout (update logout_time of last session)
# ==================================================
@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    try:
        last_log = (
            LoginLog.objects.filter(
                account=user if isinstance(user, Account) else None,
                status=LoginLog.Status.SUCCESS,
            )
            .latest("login_time")
        )
        last_log.logout_time = now()
        last_log.save(update_fields=["logout_time"])
    except LoginLog.DoesNotExist:
        logger.warning(f"No login log found for logout of user {user}")
    except Exception as e:
        logger.error(f"Failed to log user logout: {e}")
# ==================================================
# Write audit logs for Account model when created/updated Lecturer model when created/updated
# ==================================================
@receiver(post_save, sender=Account)
def audit_account(sender, instance, created, **kwargs):
    user, ip, ua = get_request_info()
    if not user:
        return
    
    AuditLog.objects.create(
        operation=AuditLog.Operation.CREATE if created else AuditLog.Operation.UPDATE,
        old_data={},
        new_data=serialize_instance(instance, exclude_fields=["avatar"]),
        changed_by=user,
        ip_address=ip,
        user_agent=ua,
        record_id=str(instance.pk),
        entity_id=str(instance.pk),
        entity_name="Account",
        action_description="Tạo tài khoản" if created else "Cập nhật tài khoản"
    )

@receiver(post_save, sender=Lecturer)
def audit_lecturer(sender, instance, created, **kwargs):
    user, ip, ua = get_request_info()
    if not user:
        return
    
    AuditLog.objects.create(
        operation=AuditLog.Operation.CREATE if created else AuditLog.Operation.UPDATE,
        old_data={}, 
        new_data=serialize_instance(instance),
        changed_by=user,
        ip_address=ip,
        user_agent=ua,
        record_id=str(instance.pk),
        entity_id=str(instance.pk),
        entity_name="Lecturer",
        action_description="Tạo hồ sơ giảng viên" if created else "Cập nhật hồ sơ giảng viên"
    )
# ==================================================
# Get request metadata helper
# ==================================================
def get_request_meta():
    request = get_current_request()
    if request:
        return {
            "user": request.user if request.user.is_authenticated else None,
            "ip": request.META.get("REMOTE_ADDR"),
            "user_agent": request.META.get("HTTP_USER_AGENT", ""),
        }
    return {"user": None, "ip": "unknown", "user_agent": "unknown"}

# ==================================================
# Write audit logs for LecturerSubject and SubjectClass models
# ==================================================
@receiver(post_save, sender=LecturerSubject)
def log_lecturer_subject_create(sender, instance, created, **kwargs):
    if created:
        meta = get_request_meta()
        AuditLog.objects.create(
            operation="C",
            old_data={},
            new_data={
                "lecturer_id": instance.lecturer_id,
                "subject_id": instance.subject_id,
            },
            ip_address=meta["ip"],
            user_agent=meta["user_agent"],
            changed_by=meta["user"],
            record_id=str(instance.pk),
            entity_id=str(instance.pk),
            entity_name="LecturerSubject",
            action_description="Tự động log: Gán môn học cho giảng viên",
        )

# ==================================================
# Write audit logs for SubjectClass
# ==================================================
@receiver(post_save, sender=SubjectClass)
def log_subject_class_create(sender, instance, created, **kwargs):
    if created:
        meta = get_request_meta()
        AuditLog.objects.create(
            operation="C",
            old_data={},
            new_data={
                "subject_id": instance.subject_id,
                "class_id": instance.class_id_id,
                "lecturer_id": instance.lecturer_id,
                "semester_id": instance.semester_id,
            },
            ip_address=meta["ip"],
            user_agent=meta["user_agent"],
            changed_by=meta["user"],
            record_id=str(instance.pk),
            entity_id=str(instance.pk),
            entity_name="SubjectClass",
            action_description="Tự động log: Gán lớp học cho giảng viên",
        )
# ==================================================
# Create log when reminder is created
# ==================================================
@receiver(post_save, sender=Reminder)
def create_audit_log_for_reminder(sender, instance, created, **kwargs):
    if created:
        AuditLog.objects.create(
            operation=AuditLog.Operation.CREATE,
            new_data={
                "title": instance.title,
                "content": instance.content,
                "student": instance.student_id,
                "subject": instance.subject_id,
            },
            entity_id=str(instance.reminder_id),
            entity_name="Reminder",
            module_name="notifications",
            action_description=f"Tạo nhắc nhở: {instance.title}",
            changed_by=instance.student.account if hasattr(instance.student, "account") else None
        )
# ==================================================
# Create log for all model, including create, update and delete
# ==================================================
def json_safe(value):
    if isinstance(value, (datetime.datetime, datetime.date)):
        return value.isoformat()
    if isinstance(value, decimal.Decimal):
        return float(value)
    if isinstance(value, uuid.UUID):
        return str(value)
    if isinstance(value, FieldFile):
        return value.url if value and hasattr(value, "url") else None
    return value
    
def serialize_instance(instance):
    """
    Convert model instance -> dict JSON-safe.
    Image/FileField sẽ chỉ lấy đường dẫn (string).
    """
    try:
        data = model_to_dict(instance)
        return {k: json_safe(v) for k, v in data.items()}
    except Exception:
        return {"id": getattr(instance, "pk", None)}


@receiver(pre_save)
def audit_pre_save(sender, instance, **kwargs):
    """
    Save old instance data before updating.
    """
    if sender.__name__ == "AuditLog":
        return  # avoid logging itself, causing recursion
    if not instance.pk:  
        return  # new object (create), no need for old_data

    try:
        old_instance = sender.objects.get(pk=instance.pk)
        _PREVIOUS_STATE[(sender, instance.pk)] = serialize_instance(old_instance)
    except sender.DoesNotExist:
        pass


@receiver(post_save)
def audit_post_save(sender, instance, created, **kwargs):
    """
    Log when model is created or updated.
    """
    if sender.__name__ == "AuditLog":
        return

    old_data = None
    if not created:
        old_data = _PREVIOUS_STATE.pop((sender, instance.pk), None)

    AuditLog.objects.create(
        operation=AuditLog.Operation.CREATE if created else AuditLog.Operation.UPDATE,
        old_data=old_data,
        new_data=serialize_instance(instance),
        entity_id=str(instance.pk),
        entity_name=sender.__name__,
        module_name=instance._meta.app_label,
        action_description=f"{'Created' if created else 'Updated'} {sender.__name__} (ID={instance.pk})",
        changed_by=get_current_user(),
    )

@receiver(post_delete)
def audit_post_delete(sender, instance, **kwargs):
    """
    Log when model is deleted.
    """
    if sender.__name__ == "AuditLog":
        return

    AuditLog.objects.create(
        operation=AuditLog.Operation.DELETE,
        old_data=serialize_instance(instance),
        new_data=None,
        entity_id=str(instance.pk),
        entity_name=sender.__name__,
        module_name=instance._meta.app_label,
        action_description=f"Deleted {sender.__name__} (ID={instance.pk})",
        changed_by=get_current_user(),
    )