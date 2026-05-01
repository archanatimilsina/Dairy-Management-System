from django.contrib import admin
from .models import Contact

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    #showng all fields of Contact Tab;e
    list_display = tuple(field.name for field in Contact._meta.fields)
    
    # correct too
    # list_display = [field.name for field in Contact._meta.fields] 
