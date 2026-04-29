from django.shortcuts import render
from .serializers import FeedbackSerializer
from rest_framework import generics
from .models import Feedback

class FeedbackListCreateView(generics.ListCreateAPIView):
    queryset= Feedback.objects.all()
    serializer_class = FeedbackSerializer


class FeedbackDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset= Feedback.objects.all()
    serializer_class = FeedbackSerializer

    