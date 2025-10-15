from celery import shared_task
from django.utils import timezone
from .models import LeaveRequest

@shared_task
def auto_approve_leave_request(leave_request_id):
    try:
        leave_request = LeaveRequest.objects.get(pk=leave_request_id)
        if leave_request.status == "P":
            leave_request.status = "A"
            leave_request.reviewed_at = timezone.now()
            leave_request.save(update_fields=["status", "reviewed_at"])
            print(f"Auto-approved: {leave_request.leave_request_id}")
    except LeaveRequest.DoesNotExist:
        pass