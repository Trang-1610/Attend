from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import LeaveRequest
from .tasks import auto_approve_leave_request

@receiver(post_save, sender=LeaveRequest)
def schedule_auto_approval(sender, instance, created, **kwargs):
    if created:
        auto_approve_leave_request.apply_async((instance.leave_request_id,), countdown=300)