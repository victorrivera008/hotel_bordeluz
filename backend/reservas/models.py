from django.db import models
from usuarios.models import Usuario

class TipoHabitacion(models.Model):
    nombre = models.CharField(max_length=100)
    capacidad_maxima = models.IntegerField(default=2)
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self): return self.nombre

class Habitacion(models.Model):
    ESTADO_CHOICES = [('LIBRE', 'Libre'), ('OCUPADA', 'Ocupada'), ('MANTENIMIENTO', 'Mantenimiento')]
    numero = models.CharField(max_length=10, unique=True)
    tipo = models.ForeignKey(TipoHabitacion, on_delete=models.CASCADE)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='LIBRE')
    def __str__(self): return f"Habitación {self.numero} ({self.tipo.nombre})"

class Servicio(models.Model):
    nombre = models.CharField(max_length=150)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self): return self.nombre

class Reserva(models.Model):
    ESTADO_RESERVA_CHOICES = [('PENDIENTE', 'Pendiente'), ('CONFIRMADA', 'Confirmada'), ('CANCELADA', 'Cancelada')]
    codigo_reserva = models.CharField(max_length=20, unique=True)
    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='reservas_cliente')
    habitacion = models.ForeignKey(Habitacion, on_delete=models.PROTECT)
    fecha_checkin = models.DateField()
    fecha_checkout = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADO_RESERVA_CHOICES, default='PENDIENTE')
    total_pagado = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    servicios_adicionales = models.ManyToManyField(Servicio, through='ItemServicioReserva')
    def __str__(self): return f"Reserva {self.codigo_reserva}"

class ItemServicioReserva(models.Model):
    reserva = models.ForeignKey(Reserva, on_delete=models.CASCADE)
    servicio = models.ForeignKey(Servicio, on_delete=models.PROTECT)
    cantidad = models.IntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        unique_together = ('reserva', 'servicio')