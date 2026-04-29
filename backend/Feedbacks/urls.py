from django.urls import path
from .views import FeedbackDetailView, FeedbackListCreateView
urlpatterns = [
    path('listCreate', FeedbackListCreateView.as_view(),name="FeedbackListCreateView"),
    path('detail/<int:id>', FeedbackDetailView.as_view(), name="FeedbackDetailView")
]
