from django.urls import path
from .views import (
    LecturerListAPIView, AllLecturerView, LecturerAssignmentAPIView, 
    LecturerWithSubjectsAPIView, LecturerContactAPIView, TotalLecturerView
)

urlpatterns = [
    path('all/', LecturerListAPIView.as_view(), name='get-list-all-lecturer'),
    path('assignment-class/', LecturerAssignmentAPIView.as_view(), name='lecturer-assignment'),
    path('lecturer-subject/', LecturerWithSubjectsAPIView.as_view(), name='lecturer-subject'),

    # Contact
    path('lecturer-contact/', LecturerContactAPIView.as_view(), name='lecturer-contact'),

    # Get total lecturer
    path('admin/total-lecturer/', TotalLecturerView.as_view(), name='get-total-lecturer'),
]