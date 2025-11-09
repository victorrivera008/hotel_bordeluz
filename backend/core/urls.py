from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView 

from core.views import HealthCheckAPI 
from reservas.views import ReservaViewSet 
from reportes.views import DashboardEjecutivoAPI
from usuarios.views import CustomTokenObtainPairView 

router = DefaultRouter()
router.register(r'reservas', ReservaViewSet, basename='reserva') 

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
    path('api/auth/', include('usuarios.urls')), 
    

    path('status/', HealthCheckAPI.as_view(), name='health_check'), 
    
    path('api/', include(router.urls)), 
    path('api/reportes/dashboard/', DashboardEjecutivoAPI.as_view(), name='dashboard_ejecutivo'),
]