from django.urls import path
from .views import OrderDetailView, OrderListCreateView
urlpatterns = [
    path('listCreate/',OrderListCreateView.as_view(), name="OrderListCreateView"),
    path("detail/<int:pk>", OrderDetailView.as_view(), name='OrderDetailView')
]
