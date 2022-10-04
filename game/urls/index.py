from django.urls import path, include
from django.views.index import index

urlpatterns = [
    path("", index, name="global_index")
    path("menu/", include("game.urls.menu.index")),
    path("playground/", include("game.urls.playground.index")),
    path("settings/", include("game.urls.settings.index")),
]