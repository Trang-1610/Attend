from django.urls import path
from .views import (
    AttendanceSummaryView, AttendanceHistoryView, AttendanceStatisticView
)

urlpatterns = [
    path("attendance-summary/<int:account_id>/", AttendanceSummaryView.as_view(), name="attendance-summary"),
    path("attendance-history/<int:account_id>/", AttendanceHistoryView.as_view(), name="attendance-history"),
    path("attendance-statistics/<int:account_id>/", AttendanceStatisticView.as_view(), name="attendance-statistics"),
]