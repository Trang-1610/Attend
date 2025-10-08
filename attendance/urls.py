from django.urls import path
from .views import (
    AttendanceSummaryView, AttendanceHistoryView, AttendanceStatisticView, AttendanceStatisticTotalView,
    AttendanceStatisticByDepartmentView
)

urlpatterns = [
    path("attendance-summary/<int:account_id>/", AttendanceSummaryView.as_view(), name="attendance-summary"),
    path("attendance-history/<int:account_id>/", AttendanceHistoryView.as_view(), name="attendance-history"),
    path("attendance-statistics/<int:account_id>/", AttendanceStatisticView.as_view(), name="attendance-statistics"),
    # Calculate the total of attendance
    path("admin/attendance-statistics-total/", AttendanceStatisticTotalView.as_view(), name="attendance-statistics-total"),
    # Calculate the total of attendance by department
    path(
        "admin/attendance-statistics-by-department/<int:semester_id>/<int:academic_year_id>/",
        AttendanceStatisticByDepartmentView.as_view(),
        name="attendance-statistics-by-department",
    ),
]