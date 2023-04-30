from django.urls import path, re_path
from game.views.graph.index import index

urlpatterns = [
    re_path(r".*", index, name="graph_index"),
]
