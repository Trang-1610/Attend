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