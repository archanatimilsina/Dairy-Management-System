from django.urls import path
from .views import ContactListCreateView, ContactDetailView
urlpatterns = [
    path('listCreate/', ContactListCreateView.as_view() ,name = "ContactListCreateView"),
    path('detail/<int:pk>' , ContactDetailView.as_view() ,name = "ContactDetailView")
]

