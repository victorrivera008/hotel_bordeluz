from rest_framework import serializers
from .models import TipoHabitacion, Habitacion, Servicio, Reserva, ItemServicioReserva
from django.db import transaction
from datetime import date
from usuarios.models import Usuario, Rol 
from django.core.mail import send_mail 
from django.conf import settings
from django.utils.crypto import get_random_string 


class TipoHabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoHabitacion
        fields = '__all__'

class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__'

class HabitacionSerializer(serializers.ModelSerializer):
    tipo_nombre = serializers.ReadOnlyField(source='tipo.nombre')
    class Meta:
        model = Habitacion
        fields = ['id', 'numero', 'tipo', 'tipo_nombre', 'estado']


class HabitacionDisponibleSerializer(serializers.ModelSerializer):
    tipo_detalle = TipoHabitacionSerializer(source='tipo', read_only=True) 
    class Meta:
        model = Habitacion
        fields = ['id', 'numero', 'estado', 'tipo', 'tipo_detalle']

class ItemServicioReservaSerializer(serializers.ModelSerializer):
    servicio_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = ItemServicioReserva
        fields = ['servicio_id', 'cantidad']

class ReservaSerializer(serializers.ModelSerializer):
    servicios = ItemServicioReservaSerializer(many=True, required=False)
    cliente_nombre = serializers.ReadOnlyField(source='cliente.username')
    guest_data = serializers.JSONField(write_only=True, required=False)
    
    class Meta:
        model = Reserva
        fields = ['id', 'codigo_reserva', 'cliente', 'cliente_nombre', 'habitacion', 'fecha_checkin', 'fecha_checkout', 'estado', 'total_pagado', 'servicios', 'guest_data']
        read_only_fields = ['id', 'codigo_reserva', 'total_pagado', 'cliente'] 
        
    def validate(self, data):
        if data['fecha_checkin'] >= data['fecha_checkout']:
            raise serializers.ValidationError("La fecha de check-out debe ser posterior al check-in.")
        return data
    
    @transaction.atomic 
    def create(self, validated_data):
        servicios_data = validated_data.pop('servicios', [])
        guest_data = validated_data.pop('guest_data', None)
        
        request = self.context.get('request')
        cliente = None
        password_generada = None 

        if request and request.user.is_authenticated:
            cliente = request.user
        elif guest_data:
            email = guest_data.get('email')
            try:
                cliente = Usuario.objects.get(email=email)
            except Usuario.DoesNotExist:
                password_generada = get_random_string(length=12)
                
                cliente = Usuario.objects.create_user(
                    username=email, 
                    email=email,
                    password=password_generada, 
                    first_name=guest_data.get('first_name', ''),
                    last_name=guest_data.get('last_name', ''),
                    telefono=guest_data.get('telefono', '')
                )
                try:
                    rol_cliente = Rol.objects.get(id=4)
                    cliente.rol = rol_cliente
                    cliente.save()
                except:
                    pass
        else:
            raise serializers.ValidationError("Debe iniciar sesión o proporcionar datos de invitado.")

        validated_data['cliente'] = cliente 
        
        hoy_str = date.today().strftime('%Y%m%d')
        validated_data['codigo_reserva'] = f"RSV-{hoy_str}-{Reserva.objects.count() + 1}"
        
        reserva = Reserva.objects.create(**validated_data)
        
        total_servicios = 0
        for item_data in servicios_data:
            try:
                servicio = Servicio.objects.get(id=item_data['servicio_id'])
                cantidad = item_data['cantidad']
                ItemServicioReserva.objects.create(
                    reserva=reserva, servicio=servicio, cantidad=cantidad, precio_unitario=servicio.precio
                )
                total_servicios += (cantidad * servicio.precio)
            except Servicio.DoesNotExist:
                 pass 

        dias = (reserva.fecha_checkout - reserva.fecha_checkin).days
        precio_noche = reserva.habitacion.tipo.precio_base
        total_habitacion = precio_noche * dias
        reserva.total_pagado = total_servicios + total_habitacion
        reserva.save()

        asunto = f'Confirmación de Reserva #{reserva.codigo_reserva} - Hotel Bordeluz'
        mensaje = f"""
        Hola {cliente.first_name},

        Tu reserva ha sido confirmada con éxito.
        
        Detalles:
        - Código: {reserva.codigo_reserva}
        - Habitación: {reserva.habitacion.tipo.nombre}
        - Check-in: {reserva.fecha_checkin}
        - Total: ${reserva.total_pagado}
        """

        if password_generada:
            mensaje += f"""
            
            Hemos creado una cuenta para ti para que gestiones tus reservas.
            Tus credenciales de acceso son:
            
            Usuario: {cliente.email}
            Contraseña: {password_generada}
            
            Por favor, inicia sesión y cambia tu contraseña lo antes posible.
            """

        try:
            send_mail(
                asunto,
                mensaje,
                'reservas@hotelbordeluz.cl',
                [cliente.email],
                fail_silently=True,
            )
            print(f"📧 Correo enviado a {cliente.email} (Simulado en consola)")
        except Exception as e:
            print(f" Error enviando correo: {e}")
        
        return reserva