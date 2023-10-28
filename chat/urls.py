from django.urls import path

from . import views 

urlpatterns = [
    path("", views.index, name = "index"),
    path("login/", views.login_view, name = "login"),
    path("register/", views.register, name = "register"),
    path("logout", views.logout_view, name = "logout"), 

    #chat urls
    path("chat/<str:room_name>", views.chat_room, name = "chat_room"),

    #API
    path("create_chat", views.create_chat, name = "create_chat")
]