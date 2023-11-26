from django.shortcuts import render, HttpResponseRedirect
from django.urls import reverse
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
import json

from .models import User, LiveChats, SavedChats, Messages
# Create your views here.

@login_required(login_url='login')
def index(request):
    return render(request, "chat/index.html", {"page":"index"})



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

@csrf_exempt
def chat_room(request, room_name):
    if request.method == "GET":
        username = User.objects.filter(username = request.user).values()[0]['username']
        try:
            room_data = LiveChats.objects.filter(room_name = room_name).values()[0]
        except IndexError:
            return render(request, "chat/error.html",{
                "message": "Room Does Not Exist"
            })
        creator = User.objects.get(id=room_data["creator_id"])
        #saved status check
        save_status = False
        try:
            SavedChats.objects.get(user_id = request.user, room_id = room_data['id'])
            save_status = True
        except ObjectDoesNotExist: 
            save_stats = False    
        if room_data["state"] == "private":          
            if request.user == creator:
                return render(request, 'chat/chatRoom.html',{
                    "room_name":room_name,
                    "save_status": save_status,
                    "username": username,
                    "page":"chatroom"
                })
            try:
                password = request.session[f'chat_room_{room_data["room_name"]}']
            except KeyError:
                return render(request, "chat/chat_login.html",{
                    "room_name":room_data["room_name"]
                })
            return render(request, "chat/chatRoom.html", {
                "room_name": room_name,
                "save_status": save_status,
                "username": username
            })
        elif room_data["state"] == "public":
            return render(request, "chat/chatRoom.html", {
                "room_name": room_name,
                "save_status": save_status,
                'username': username
            })
    elif request.method == "POST":
        data = json.loads(request.body)
        entered_password = data["password"]
        room_name = data["room_name"]
        chat_password = LiveChats.objects.filter(room_name = room_name).values()[0]["password"]
        print(entered_password,chat_password)
        if entered_password == chat_password:
            request.session[f'chat_room_{room_name}'] = entered_password
            return JsonResponse({"password":True})
        else:
            return JsonResponse({"password":False})
        

@csrf_exempt
def create_chat(request):
    if request.method == "POST": 
        data = json.loads(request.body)
        print(data["chat_category"])
        x = LiveChats.objects.filter(room_name = data["chat_name"])
        if len(x) != 1:
            if data["chat_state"] == "public":
                LiveChats.objects.create(room_name = data["chat_name"], creator = request.user,state="public", password = "", category = data["chat_category"])
            elif data["chat_state"] == "private":
                LiveChats.objects.create(room_name = data["chat_name"], creator = request.user,state="private", password = data["chat_password"], category = data["chat_category"])
            return JsonResponse ({"available": "yes"})
        else:
            return JsonResponse ({"available": "no"})

@csrf_exempt   
def chat_room_info(request):
    if request.method == "GET":
        all_chats_data = LiveChats.objects.all().values()
        all_chats = []
        for chat in all_chats_data:
            creator_username = User.objects.filter(id = chat["creator_id"]).values()[0]["username"]
            chat["creator_id"] = creator_username
            all_chats.append(chat)
        return JsonResponse({"info":all_chats})
    elif request.method == "POST":
        chat_name = json.loads(request.body)['chat_name']
        chats_query = LiveChats.objects.filter(room_name__contains = chat_name).values()
        chats = []
        for x in chats_query:
            x["creator_id"] = User.objects.filter(id = x["creator_id"]).values()[0]["username"]
            chats.append(x)
        return JsonResponse({"chat_name":chats})

def my_chats_info(request):
    my_chats_data = LiveChats.objects.filter(creator = request.user).values()
    my_chats_data_list = []
    for chat in my_chats_data:
        creator_username = User.objects.filter(id = chat["creator_id"]).values()[0]["username"]
        chat["creator_id"] = creator_username
        my_chats_data_list.append(chat)
    print(my_chats_data_list)
    return JsonResponse({"data":my_chats_data_list})

@csrf_exempt
def remove_chat(request):
    if request.method == "POST":
        data = json.loads(request.body)
        room_name = data["room_name"]
        LiveChats.objects.get(room_name = room_name).delete()
        return JsonResponse({"Outcome":"success"})
    return JsonResponse({"Outcome":"Incorrect method"})

@csrf_exempt
def save_chat(request):
    if request.method == "POST":
        data = json.loads(request.body)
        save_action = data["save_action"]
        room_name = data["room_name"]
        livechats_room = LiveChats.objects.get(room_name = room_name)
        if save_action == "save":
            SavedChats.objects.create(room_id = livechats_room, user_id = request.user)
        elif save_action == "unsave":
            SavedChats.objects.get(room_id = livechats_room, user_id = request.user).delete()
        return JsonResponse({"Outcome":"Process done"})
    else:
        return JsonResponse({"Outcome":"Incorrect method"})
    
@csrf_exempt
def saved_chats(request):
        saved_chats_query = SavedChats.objects.filter(user_id = request.user).values()
        saved_chats = []
        for x in saved_chats_query:
            chat = LiveChats.objects.filter(id = x["room_id_id"]).values()[0]
            chat["creator_id"] = User.objects.filter(id = chat["creator_id"]).values()[0]["username"]
            saved_chats.append(chat)
        return JsonResponse({"data":saved_chats})

@csrf_exempt
def past_chat_messages(request):
    if request.method == "POST":
        data = json.loads(request.body)
        chat = LiveChats.objects.get(room_name = data["room_name"])
        past_messages_query = Messages.objects.filter(chat = chat).values()
        past_messages  = []
        for x in past_messages_query:
            x["sender_id"] = User.objects.filter(id = x["sender_id"]).values()[0]["username"]
            past_messages.append(x)
        print(past_messages)
        return JsonResponse({"data":past_messages})
    else:
        return JsonResponse({"Error":"Incorrect calling method"})