from django.contrib import admin

from .models import LiveChats, User, SavedChats
# Register your models here.

admin.site.register(LiveChats)
admin.site.register(User)
admin.site.register(SavedChats)