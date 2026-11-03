from django.shortcuts import render
from .serializers import ContactSerializer 
from .models import Contact
from rest_framework import generics
from rest_framework.permissions import IsAdminUser

class ContactListCreateView(generics.ListCreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def get_permissions(self):
        from rest_framework.permissions import AllowAny, IsAdminUser
        # Anyone can submit; only staff can list.
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAdminUser()]


class ContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAdminUser]
