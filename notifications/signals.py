from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.utils.timezone import now
from notifications.models import Notification, Reminder
from accounts.models import Account
from audit.models import AuditLog
import json
from django.db.models.signals import post_save
from lecturers.models import Lecturer
from attend3d.middleware.thread_local import get_current_request
from helper.get_client_ip import get_client_ip
from lecturers.models import LecturerSubject, SubjectClass

# ==================================================
# Create notification when user login
# ==================================================
@receiver(user_logged_in)
def handle_user_login(sender, request, user, **kwargs):
    ip = get_client_ip(request)
    user_agent = request.META.get("HTTP_USER_AGENT", "unknown")

    # 1. Create Notification
    Notification.objects.create(
        title="Đăng nhập thành công",
        content=f"Tài khoản của bạn đã đăng nhập lúc {now().strftime('%H:%M:%S %d-%m-%Y')}",
        created_by=user,
        to_target=user
    )
# ==================================================
# Create notification when lecturer is created
# ==================================================
@receiver(post_save, sender=Lecturer)
def notify_new_lecturer(sender, instance, created, **kwargs):
    if not created:
        return

    request = get_current_request()
    if not request or not hasattr(instance, "account"):
        return
    
    Notification.objects.create(
        title=f"Tài khoản giảng viên mới: {instance.fullname}",
        content=f"Giảng viên {instance.fullname} đã được thêm vào hệ thống.",
        created_by=request.user,
        to_target=instance.account,
    )
# ==================================================
# Create notification when lecturer subject model is created
# ==================================================
@receiver(post_save, sender=SubjectClass)
def notify_subject_class(sender, instance, created, **kwargs):
    if not created:
        return

    request = get_current_request()
    user = request.user if request else None

    Notification.objects.create(
        title=f"Phân công giảng viên {instance.lecturer.fullname}",
        content=f"Giảng viên {instance.lecturer.fullname} được phân công dạy môn "
                f"{instance.subject.subject_name} cho lớp {instance.class_id.class_name} "
                f"(học kỳ {instance.semester.semester_name}).",
        created_by=user,
        to_target=instance.lecturer.account
    )
# ==================================================
# Create notification when reminder data is created
# ==================================================
@receiver(post_save, sender=Reminder)
def create_notification_for_reminder(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            title=f"Nhắc nhở: {instance.title}",
            content=instance.content,
            created_by=instance.student.account,
            to_target=instance.student.account
        )