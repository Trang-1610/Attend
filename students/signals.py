from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import Major, Student
from audit.models import AuditLog
from notifications.models import Notification
from django.forms.models import model_to_dict
from attend3d.middleware.thread_local import get_current_request
from accounts.models import Account
import json
from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import datetime
from .models import SubjectRegistrationRequest, StudentSubject
from subjects.models import Subject
from accounts.utils.serializers import serialize_instance

_old_instance_cache = {}

def get_request_user_ip_agent():
    """ Get user, ip, user_agent from current request """
    request = get_current_request()
    if not request:
        return None, None, None
    user = getattr(request, "user", None)
    ip_address = request.META.get("REMOTE_ADDR", None)
    user_agent = request.META.get("HTTP_USER_AGENT", None)
    return user, ip_address, user_agent

@receiver(pre_save, sender=Major)
def store_old_major(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._old_instance = Major.objects.select_related('department').get(pk=instance.pk)
        except Major.DoesNotExist:
            instance._old_instance = None


@receiver(post_save, sender=Major)
def log_major_update(sender, instance, created, **kwargs):
    if created or not hasattr(instance, '_old_instance'):
        return

    request = get_current_request()
    user = getattr(request, 'user', None) if request else None
    ip = request.META.get("REMOTE_ADDR", "") if request else ""
    ua = request.META.get("HTTP_USER_AGENT", "") if request else ""

    if not user or not user.is_authenticated:
        return

    # Retrieve from DB to ensure department data is updated
    instance.refresh_from_db()

    old_instance = instance._old_instance
    changes = {}

    if old_instance.major_name != instance.major_name:
        changes['major_name'] = (old_instance.major_name, instance.major_name)

    if (old_instance.department and instance.department and 
        old_instance.department.department_id != instance.department.department_id):
        changes['department'] = (
            old_instance.department.department_name if old_instance.department else "Không có",
            instance.department.department_name if instance.department else "Không có"
        )

    # If there is any change then log.
    if changes:
        # Create Notification
        Notification.objects.create(
            title="Ngành học được cập nhật",
            content=f"Ngành {instance.major_name} đã được cập nhật.",
            created_by=user,
            to_target=user,
        )

        # Log Audit
        AuditLog.objects.create(
            operation='U',
            old_data=model_to_dict(old_instance),
            new_data=model_to_dict(instance),
            changed_by=user,
            ip_address=ip,
            user_agent=ua,
            record_id=str(instance.pk),
            entity_id="Major",
            entity_name=instance.major_name,
            action_description="Ngành học đã được cập nhật bởi admin"
        )

# ==================================== Write for update information ==========================================
@receiver(pre_save, sender=Account)
def account_pre_save(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = Account.objects.get(pk=instance.pk)
            instance._old_data = serialize_instance(old_instance, exclude_fields=["avatar"])
        except Account.DoesNotExist:
            instance._old_data = None

@receiver(post_save, sender=Account)
def account_post_save(sender, instance, created, **kwargs):
    new_data = serialize_instance(instance, exclude_fields=["avatar"])

    if created:
        AuditLog.objects.create(
            operation=AuditLog.Operation.CREATE,
            new_data=new_data,
            changed_by=getattr(instance, "_changed_by", None),
            entity_name="Account",
            record_id=str(instance.pk),
            action_description="Tạo tài khoản mới",
        )
    else:
        old_data = getattr(instance, "_old_data", None)
        if old_data != new_data:
            AuditLog.objects.create(
                operation=AuditLog.Operation.UPDATE,
                old_data=old_data,
                new_data=new_data,
                changed_by=getattr(instance, "_changed_by", None),
                entity_name="Account",
                record_id=str(instance.pk),
                action_description="Cập nhật tài khoản",
            )


# ======================== STUDENT ===========================
@receiver(pre_save, sender=Student)
def student_pre_save(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = Student.objects.get(pk=instance.pk)
            _old_instance_cache[f"student_{instance.pk}"] = model_to_dict(old_instance)
        except Student.DoesNotExist:
            pass


@receiver(post_save, sender=Student)
def student_post_save(sender, instance, created, **kwargs):
    old_data = _old_instance_cache.pop(f"student_{instance.pk}", None)
    new_data = model_to_dict(instance)

    user, ip, ua = get_request_user_ip_agent()
    if not user:
        return

    AuditLog.objects.create(
        operation="C" if created else "U",
        old_data=old_data if old_data else {},
        new_data=new_data,
        changed_by=user,
        ip_address=ip or "",
        user_agent=ua or "",
        record_id=str(instance.pk),
        entity_id=str(instance.pk),
        entity_name="Student",
        action_description="Hồ sơ sinh viên được tạo" if created else "Cập nhật thông tin sinh viên",
    )

# ======================== STUDENT ===========================
@receiver(post_save, sender=SubjectRegistrationRequest)
def handle_registration_request(sender, instance, created, **kwargs):
    if instance.status == "approved":
        subject = Subject.objects.get(subject_id=instance.subject_id)

        if subject.credits == 1:
            total_sessions = 15
        elif subject.credits == 2:
            total_sessions = 15
        else:
            total_sessions = (subject.credits * 15) // 3

        max_leave_days = int(total_sessions * 0.3)

        StudentSubject.objects.get_or_create(
            student=instance.student,
            subject=subject,
            defaults={"max_leave_days": max_leave_days}
        )