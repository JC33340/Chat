from django.shortcuts import render, HttpResponseRedirect
from django.urls import reverse
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json

from .models import User, LiveChats
# Create your views here.

@login_required(login_url='login')
def index(request):
    return render(request, "chat/index.html")



def login_view(request):
    if request.method == "GET":
        return render(request, "chat/login.html")
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username = username, password = password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "chat/login.html", {"message":"User does not exist"})
        


def register(request):
    if request.method == "GET":
        return render(request, "chat/register.html")
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        confirmation = request.POST['password_confirmation']

        #checking passwords match
        if password != confirmation:
            return render(request,"chat/register.html", {
                "message": "Passwords do not match"
            })
        
        try:
            user = User.objects.create_user(username, email = None, password = confirmation)
            user.save()
        except IntegrityError:
            return render(request, "chat/register.html",{
                "message":"Username already in use"
            })

        return render(request, "chat/login.html")
    
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def chat_room(request, room_name):
    return render(request, "chat/chatRoom.html", {
        "room_name": room_name
    })

@csrf_exempt
def create_chat(request):
    if request.method == "POST": 
        data = json.loads(request.body)

        x = LiveChats.objects.filter(room_name = data["chat_name"])
        if len(x) != 1:
            if data["chat_state"] == "public":
                LiveChats.objects.create(room_name = data["chat_name"], creator = request.user,state="public", password = None)
            elif data["chat_state"] == "private":
                LiveChats.objects.create(room_name = data["chat_name"], creator = request.user,state="private", password = data["chat_password"])
            return JsonResponse ({"available": "yes"})
        else:
            return JsonResponse ({"available": "no"})