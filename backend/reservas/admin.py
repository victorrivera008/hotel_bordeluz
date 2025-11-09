from django.contrib import admin
from .models import TipoHabitacion, Habitacion, Servicio, Reserva, ItemServicioReserva

admin.site.register(TipoHabitacion)
admin.site.register(Habitacion)
admin.site.register(Servicio)
admin.site.register(Reserva)
admin.site.register(ItemServicioReserva)