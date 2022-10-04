from django.shortcuts import render

def index(request):
    return render(request, "multi-terminal/web.html")
