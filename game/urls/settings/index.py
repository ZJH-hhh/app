from django.urls import path, include
from game.views.settings.getinfo import InfoView
from game.views.settings.register import RegisterView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("api/token/",TokenObtainPairView.as_view(), name="settings_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="settings_refresh"),
    path("getinfo/", InfoView.as_view(), name="settings_getinfo"),
    path("register/", RegisterView.as_view(), name="settings_register"),
    path("acwing/", include("game.urls.settings.acwing.index")),
]
