from django.db import models
from usuarios.models import Usuario
from decimal import Decimal


class TipoHabitacion(models.Model):
    nombre = models.CharField(max_length=100)
    capacidad_maxima = models.IntegerField(default=2)
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.nombre


class Habitacion(models.Model):
    ESTADO_CHOICES = [
        ('LIBRE', 'Libre'),
        ('OCUPADA', 'Ocupada'),
        ('MANTENIMIENTO', 'Mantenimiento'),
    ]
    numero = models.CharField(max_length=10, unique=True)
    tipo = models.ForeignKey(TipoHabitacion, on_delete=models.CASCADE)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='LIBRE')

    def __str__(self):
        return f"Habitación {self.numero} ({self.tipo.nombre})"


class Servicio(models.Model):
    TIPO_SERVICIO_CHOICES = [
        ('SAUNA', 'Sauna'),
        ('MASAJE', 'Masaje'),
        ('TINAJA', 'Tinaja'),
        ('OTRO', 'Otro'),
    ]

    nombre = models.CharField(max_length=100, unique=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    # NUEVOS CAMPOS
    tipo = models.CharField(
        max_length=20,
        choices=TIPO_SERVICIO_CHOICES,
        default='OTRO'
    )
    duracion_minutos = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Duración estándar del servicio en minutos"
    )
    personas_incluidas = models.PositiveIntegerField(
        default=1,
        help_text="Nº de personas incluidos en el precio base"
    )
    recargo_persona_extra = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Recargo por cada persona extra sobre las personas_incluidas"
    )

    def __str__(self):
        return self.nombre


class Reserva(models.Model):
    ESTADO_RESERVA_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('CONFIRMADA', 'Confirmada'),
        ('CANCELADA', 'Cancelada'),
    ]

    codigo_reserva = models.CharField(max_length=20, unique=True)

    # Puede ser null si es invitado
    cliente = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reservas_cliente'
    )

    # 👇 AHORA PERMITE NULL / BLANK PARA RESERVA SOLO SERVICIOS
    habitacion = models.ForeignKey(
        Habitacion,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )

    fecha_checkin = models.DateField()
    fecha_checkout = models.DateField()

    # CANTIDAD DE PERSONAS EN LA RESERVA
    cantidad_personas = models.PositiveIntegerField(default=1)

    estado = models.CharField(
        max_length=20,
        choices=ESTADO_RESERVA_CHOICES,
        default='PENDIENTE'
    )

    total_pagado = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00
    )

    servicios_adicionales = models.ManyToManyField(
        Servicio,
        through='ItemServicioReserva'
    )

    def __str__(self):
        return f"Reserva {self.codigo_reserva}"

    # ====== MÉTODOS DE CÁLCULO ======

    def calcular_noches(self):
        """Devuelve la cantidad de noches de la reserva (mínimo 1)."""
        noches = (self.fecha_checkout - self.fecha_checkin).days
        if noches < 1:
            noches = 1
        return noches

    def calcular_total_hospedaje(self):
        """
        Calcula el valor del hospedaje sin servicios.
        Si no hay habitación (reserva solo de servicios), retorna 0.
        """
        if not self.habitacion:
            return Decimal('0')

        noches = self.calcular_noches()
        precio_noche = self.habitacion.tipo.precio_base
        return precio_noche * noches

    def recalcular_total(self):
        """
        Recalcula el total de la reserva:
        - Hospedaje (habitacion x noches) si hay habitación
        - + todos los items de servicio.
        """
        total = Decimal('0')

        # total hospedaje (0 si no hay habitación)
        total += self.calcular_total_hospedaje()

        # total servicios
        for item in self.items_servicio.all():
            total += item.subtotal

        self.total_pagado = total
        self.save(update_fields=['total_pagado'])


class ItemServicioReserva(models.Model):
    reserva = models.ForeignKey(
        'Reserva',
        on_delete=models.CASCADE,
        related_name='items_servicio'
    )
    servicio = models.ForeignKey(Servicio, on_delete=models.PROTECT)
    cantidad = models.PositiveIntegerField(default=1)  # nº de sesiones / bloques
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def calcular_subtotal(self):
        """
        Calcula el subtotal de servicios.
        (ahora sin regla especial complicada; ya dejamos "por habitación" en hospedaje)
        """
        from decimal import Decimal

        base = self.servicio.precio * self.cantidad
        extra = Decimal('0')

        # Si algún día vuelves a usar recargo_persona_extra, aquí va la lógica.
        # Por ahora lo dejamos sin recargo adicional:
        return base + extra

    def save(self, *args, **kwargs):
        # recalcular siempre el subtotal al guardar
        self.subtotal = self.calcular_subtotal()
        super().save(*args, **kwargs)
