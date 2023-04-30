
from django.urls import path, re_path
from game.views.myspace.index import index

urlpatterns = [
    re_path(r".*", index, name="myspace_index"),
]

