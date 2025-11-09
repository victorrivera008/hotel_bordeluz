from django.urls import path
from .views import RegistroUsuarioAPIView

urlpatterns = [
    path('register/', RegistroUsuarioAPIView.as_view(), name='user_register'),
]