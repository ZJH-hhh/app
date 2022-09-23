from django.http import HttpResponse

def index(request):
    title = '<h1 style="text-align: center">hello world</h1>'
    line = '<hr>'
    image = '<img src="https://seopic.699pic.com/photo/30004/5383.jpg_wh1200.jpg" width=1500>'
    url = '<a href="/play/">游戏界面</a>'
    return HttpResponse(title + line + url + image)

def play(request):
    res = '<h1 style="text-align: center">进入游戏</h1>'
    line = '<hr>'
    image = '<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS28iCOS1U6lfH8dPEk_KlQE7V1D-ZbxAIz5SJae9R7&s" width=1500>'
    url = '<a href="/">主页面</a>'
    return HttpResponse(res + line + url + image)
