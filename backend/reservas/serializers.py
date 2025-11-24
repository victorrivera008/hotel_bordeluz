# backend/reservas/serializers.py

from rest_framework import serializers
from django.db import transaction
from datetime import date

from .models import (
    TipoHabitacion,
    Habitacion,
    Servicio,
    Reserva,
    ItemServicioReserva,
)

from django.contrib.auth import get_user_model
User = get_user_model()


# ---------------------------------------------------------
#   SERIALIZADORES DE CATÁLOGO
# ---------------------------------------------------------

class TipoHabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoHabitacion
        fields = ["id", "nombre", "precio_base", "capacidad_maxima"]


class HabitacionSerializer(serializers.ModelSerializer):
    tipo_nombre = serializers.CharField(source="tipo.nombre", read_only=True)
    capacidad_maxima = serializers.IntegerField(
        source="tipo.capacidad_maxima", read_only=True
    )
    precio_base = serializers.DecimalField(
        source="tipo.precio_base",
        max_digits=10,
        decimal_places=0,
        read_only=True,
    )

    class Meta:
        model = Habitacion
        fields = [
            "id",
            "numero",
            "estado",
            "tipo",
            "tipo_nombre",
            "capacidad_maxima",
            "precio_base",
        ]


class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = [
            "id",
            "nombre",
            "precio",
            "tipo",
            "duracion_minutos",
            "personas_incluidas",
            "recargo_persona_extra",
        ]


class HabitacionDisponibleSerializer(serializers.ModelSerializer):
    tipo_detalle = TipoHabitacionSerializer(source="tipo", read_only=True)

    class Meta:
        model = Habitacion
        fields = ["id", "numero", "estado", "tipo", "tipo_detalle"]


# ---------------------------------------------------------
#   ITEMS DE SERVICIO EN LA RESERVA
# ---------------------------------------------------------

class ItemServicioReservaSerializer(serializers.ModelSerializer):
    servicio_id = serializers.IntegerField(write_only=True)
    servicio_detalle = ServicioSerializer(source="servicio", read_only=True)

    class Meta:
        model = ItemServicioReserva
        fields = ["servicio_id", "cantidad", "subtotal", "servicio_detalle"]
        read_only_fields = ["subtotal"]


# ---------------------------------------------------------
#   SERIALIZADOR DE RESERVA (MEJORADO)
# ---------------------------------------------------------

class ReservaSerializer(serializers.ModelSerializer):
    """
    Ahora incluye:
      - habitacion_detalle
      - cliente_detalle
      - total_pagado (tu campo original)
      - servicios (como ya lo tenías)
    """

    servicios = ItemServicioReservaSerializer(many=True, required=False)

    # ----------- NUEVOS CAMPOS PARA EL FRONT (NO ROMPEN NADA) -----------
    habitacion_detalle = serializers.SerializerMethodField(read_only=True)
    cliente_detalle = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Reserva
        fields = [
            "id",
            "codigo_reserva",

            "habitacion",
            "habitacion_detalle",

            "cliente",
            "cliente_detalle",

            "fecha_checkin",
            "fecha_checkout",
            "cantidad_personas",
            "estado",
            "total_pagado",

            "servicios",
        ]
        read_only_fields = [
            "id",
            "codigo_reserva",
            "estado",
            "total_pagado",
            "cliente",
        ]

    # ---------------------------------------------------------
    #     CAMPOS DERIVADOS PARA FRONT (DETALLES BONITOS)
    # ---------------------------------------------------------

    def get_habitacion_detalle(self, obj):
        hab = obj.habitacion
        if not hab:
            return None

        tipo = hab.tipo

        return {
            "id": hab.id,
            "numero": hab.numero,
            "tipo_nombre": tipo.nombre if tipo else None,
            "capacidad_maxima": tipo.capacidad_maxima if tipo else None,
            "precio_base": tipo.precio_base if tipo else None,
        }

    def get_cliente_detalle(self, obj):
        user = obj.cliente
        if not user:
            return None

        rol = str(user.rol) if hasattr(user, "rol") and user.rol else ""

        return {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "rol": rol,
        }

    # ---------------------------------------------------------
    #                  VALIDACIONES
    # ---------------------------------------------------------

    def validate(self, data):
        fecha_checkin = data.get("fecha_checkin")
        fecha_checkout = data.get("fecha_checkout")
        habitacion = data.get("habitacion") or getattr(self.instance, "habitacion", None)

        if not fecha_checkin or not fecha_checkout:
            raise serializers.ValidationError(
                "Debe indicar fecha de check-in y check-out."
            )

        if fecha_checkin >= fecha_checkout:
            raise serializers.ValidationError(
                "La fecha de check-out debe ser posterior al check-in."
            )

        if not habitacion:
            raise serializers.ValidationError("Debe seleccionar una habitación.")

        # choques de fechas
        qs = Reserva.objects.filter(
            habitacion=habitacion,
            estado__in=["PENDIENTE", "CONFIRMADA"],
            fecha_checkin__lt=fecha_checkout,
            fecha_checkout__gt=fecha_checkin,
        )

        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                "La habitación seleccionada NO está disponible en esas fechas."
            )

        return data

    # ---------------------------------------------------------
    #                CREACIÓN
    # ---------------------------------------------------------

    @transaction.atomic
    def create(self, validated_data):
        servicios_data = validated_data.pop("servicios", [])

        # Código de reserva
        if "codigo_reserva" not in validated_data:
            hoy_str = date.today().strftime("%Y%m%d")
            correlativo = Reserva.objects.count() + 1
            validated_data["codigo_reserva"] = f"RSV-{hoy_str}-{correlativo}"

        # Crear reserva principal
        reserva = Reserva.objects.create(**validated_data)

        # Items de servicio
        for item in servicios_data:
            servicio = Servicio.objects.get(id=item["servicio_id"])
            ItemServicioReserva.objects.create(
                reserva=reserva,
                servicio=servicio,
                cantidad=item.get("cantidad", 1),
            )

        # Recalcular total
        reserva.recalcular_total()

        return reserva
