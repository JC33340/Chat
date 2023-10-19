from django.shortcuts import render, HttpResponseRedirect
from django.urls import reverse
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout

from .models import User
# Create your views here.


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