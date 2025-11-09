from django.db import models
from reservas.models import Reserva

class Transaccion(models.Model):
    ESTADO_CHOICES = [('INICIO', 'Iniciada'), ('APROBADO', 'Aprobada'), ('RECHAZO', 'Rechazada')]
    reserva = models.OneToOneField(Reserva, on_delete=models.PROTECT)
    buy_order = models.CharField(max_length=50, unique=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    token_transbank = models.CharField(max_length=255, unique=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='INICIO')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    codigo_autorizacion = models.CharField(max_length=10, blank=True, null=True)
    def __str__(self): return f"Tx {self.buy_order} - {self.estado}"