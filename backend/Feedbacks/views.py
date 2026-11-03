from django.shortcuts import render
from .serializers import FeedbackSerializer
from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from .models import Feedback

class FeedbackListCreateView(generics.ListCreateAPIView):
    queryset= Feedback.objects.all()
    serializer_class = FeedbackSerializer

    def get_permissions(self):
        from rest_framework.permissions import AllowAny, IsAdminUser
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAdminUser()]


class FeedbackDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset= Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAdminUser]

    