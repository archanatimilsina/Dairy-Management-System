from django.contrib import admin
from .models import Feedback

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display=('full_name','email','feedback','feedback_topic','created_at','is_reviewed')



