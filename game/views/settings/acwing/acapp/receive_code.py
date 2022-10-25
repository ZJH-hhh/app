from django.http import JsonResponse
from django.core.cache import cache
from django.contrib.auth.models import User
from game.models.player.player import Player
from random import randint

import requests


def receive_code(request):
    data = request.GET

    if "errcode" in data:
        return JsonResponse({
            "result": "apply field",
            "errcode": data["errcode"],
            "errmsg": data["errmsg"]
        })

    code = data.get("code")
    state = data.get("state")


    if not cache.has_key(state):
        return JsonResponse({
            "result": "state not exists"
        })

    cache.delete(state)

    apply_access_token_url = "https://www.acwing.com/third_party/api/oauth2/access_token/"
    params = {
        "appid": "2606",
        "secret": "4a2832dccdfa4da1b8793ce0a7b125f1",
        "code": code
    }

    access_token_response = requests.get(apply_access_token_url, params=params).json()

    access_token = access_token_response["access_token"]
    openid = access_token_response["openid"]

    players = Player.objects.filter(openid=openid)
    if players.exists(): # 如果该用户已存在，则无需重新获取信息，直接登录即可
        player = players[0]
        return JsonResponse({
            "result": "success",
            "username": player.user.username,
            "photo": player.photo,
        })

    get_userinfo_url = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
    params = {
        "access_token": access_token,
        "openid": openid
    }

    userinfo_response = requests.get(get_userinfo_url, params=params).json()
    username = userinfo_response["username"]
    photo = userinfo_response["photo"]

    while User.objects.filter(username=username).exists(): # 找到一个未注册的用户名
        username += str(randint(0, 9))

    user = User.objects.create(username=username)
    player = Player.objects.create(user=user, photo=photo, openid=openid)


    return JsonResponse({
        "result": "success",
        "username": player.user.username,
        "photo": player.photo
    })

