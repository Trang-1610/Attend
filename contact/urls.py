from django.urls import path
from .views import ContactCreateAPIView

urlpatterns = [
    path('add/', ContactCreateAPIView.as_view(), name='create-contact'),
]