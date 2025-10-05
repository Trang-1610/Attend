from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Contact
from .serializers import ContactSerializer

# ==============================
# Add contact serializer
# ==============================
class ContactCreateAPIView(generics.CreateAPIView):
    """
    Create a new contact
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Get the student associated with the current user
        student = getattr(self.request.user, 'student', None)
        if not student:
            raise ValueError("Current user is not a student.")
        serializer.save(from_person=student)