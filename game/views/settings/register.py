from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from game.models.player.player import Player

class RegisterView(APIView):
    def post(self, request):
        data = request.POST
        username = data.get("username", "").strip()
        password = data.get("password", "").strip()
        password_confirm = data.get("password_confirm", "").strip()

        if not username or not password:
            return Response({
                "result": "用户名或密码不能为空"
            })

        if password != password_confirm:
            return Response({
                "result": "密码不一致"
            })

        if User.objects.filter(username=username).exists():
            return Response({
                "result": "用户名已存在"
            })

        user = User(username=username)
        user.set_password(password)
        user.save()

        Player.objects.create(user=user, photo="https://img2.baidu.com/it/u=3171065239,3318992041&fm=253&fmt=auto&app=138&f=JPEG?w=440&h=440")

        return Response({
            "result": "success"
        })
