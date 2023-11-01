from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    pass

LiveChatState_choices = (
    ("public", "public"),
    ("private", "private")
)

class LiveChats(models.Model):
    room_name = models.CharField(max_length=25)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    state = models.CharField(max_length=7, choices = LiveChatState_choices, default="public")
    password = models.CharField(max_length=10, default=None, blank=True)
    
