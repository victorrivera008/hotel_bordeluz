# backend/core/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

from core.views import HealthCheckAPI
from reservas.views import (
    listar_tipos_habitacion,
    listar_habitaciones,
    listar_servicios,
    habitaciones_disponibles,
    crear_reserva,
    mis_reservas,
    cancelar_reserva,
    actualizar_reserva,
    listar_reservas_admin,   # 👈 IMPORTANTE: NUEVO
)
from reportes.views import DashboardEjecutivoAPI
from usuarios.views import CustomTokenObtainPairView


urlpatterns = [
    # Admin Django
    path('admin/', admin.site.urls),

    # Auth / JWT
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('usuarios.urls')),

    # Healthcheck
    path('status/', HealthCheckAPI.as_view(), name='health_check'),

    # --------- CATÁLOGO / CONTENIDO ---------
    path('api/tipos-habitacion/', listar_tipos_habitacion, name='tipos-habitacion-list'),
    path('api/habitaciones/', listar_habitaciones, name='habitaciones-list'),
    path('api/servicios/', listar_servicios, name='servicios-list'),

    # --------- RESERVAS ---------
    path('api/reservas/disponibilidad/', habitaciones_disponibles, name='reservas-disponibilidad'),
    path('api/reservas/', crear_reserva, name='reservas-create'),
    path('api/reservas/mis/', mis_reservas, name='mis-reservas'),
    path('api/reservas/<int:reserva_id>/cancelar/', cancelar_reserva, name='cancelar-reserva'),
    path('api/reservas/<int:reserva_id>/actualizar/', actualizar_reserva, name='actualizar-reserva'),

    # 👇 NUEVA RUTA SOLO ADMIN (STAFF)
    path('api/reservas/admin/', listar_reservas_admin, name='admin-reservas'),

    # --------- REPORTES ---------
    path('api/reportes/dashboard/', DashboardEjecutivoAPI.as_view(), name='dashboard_ejecutivo'),
]

