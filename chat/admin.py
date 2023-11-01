from django.contrib import admin

from .models import LiveChats, User
# Register your models here.

admin.site.register(LiveChats)
admin.site.register(User)