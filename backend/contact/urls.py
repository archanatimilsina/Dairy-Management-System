from django.urls import path
from .views import ContactListCreateView, ContactDetailView
urlpatterns = [
    path('listCreate/', ContactListCreateView.as_view() ,name = "ContactListCreateView"),
    path('detail/<int:id>' , ContactDetailView.as_view() ,name = "ContactDetailView")
]

