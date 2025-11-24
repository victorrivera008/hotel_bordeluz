# backend/reservas/admin.py

from django.contrib import admin
from .models import (
    Reserva,
    Habitacion,
    TipoHabitacion,
    Servicio,
    ItemServicioReserva,
)

# Acción para cancelar reservas
@admin.action(description="Cancelar reservas seleccionadas")
def cancelar_reservas(modeladmin, request, queryset):
    queryset.update(estado="CANCELADA")


@admin.register(Reserva)  # 👈 Con esto la registramos SOLO una vez
class ReservaAdmin(admin.ModelAdmin):
    list_display = (
        "codigo_reserva",
        "cliente",
        "habitacion",
        "fecha_checkin",
        "fecha_checkout",
        "estado",
        "total_pagado",
    )
    list_filter = ("estado", "fecha_checkin", "fecha_checkout")
    search_fields = ("codigo_reserva", "cliente__username", "habitacion__numero")
    actions = [cancelar_reservas]


# El resto de modelos se registran normal
@admin.register(Habitacion)
class HabitacionAdmin(admin.ModelAdmin):
    list_display = ("numero", "tipo", "estado")
    list_filter = ("estado", "tipo")
    search_fields = ("numero",)


@admin.register(TipoHabitacion)
class TipoHabitacionAdmin(admin.ModelAdmin):
    list_display = ("nombre", "capacidad_maxima", "precio_base")
    search_fields = ("nombre",)


@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ("nombre", "precio")
    search_fields = ("nombre",)


@admin.register(ItemServicioReserva)
class ItemServicioReservaAdmin(admin.ModelAdmin):
    list_display = ("reserva", "servicio", "cantidad", "subtotal")  # 👈 CAMBIADO AQUÍ
    list_filter = ("servicio",)
