from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Habitacion, Reserva, TipoHabitacion, Servicio
from .serializers import HabitacionDisponibleSerializer, ReservaSerializer, TipoHabitacionSerializer, ServicioSerializer
from django.db.models import Q
from datetime import date
from pagos.models import Transaccion 



def obtener_habitaciones_disponibles(fecha_in, fecha_out):
    reservas_conflictivas = Reserva.objects.filter(
        Q(fecha_checkin__lt=fecha_out) & Q(fecha_checkout__gt=fecha_in)
    ).values_list('habitacion_id', flat=True).distinct()
    
    habitaciones_disponibles = Habitacion.objects.filter(
        ~Q(id__in=reservas_conflictivas),
        estado='LIBRE' 
    )
    return habitaciones_disponibles




class TipoHabitacionReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    """API para obtener todos los tipos de habitación."""
    queryset = TipoHabitacion.objects.all()
    serializer_class = TipoHabitacionSerializer
    permission_classes = [permissions.AllowAny]

class ServicioReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    """API para obtener todos los servicios adicionales."""
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    permission_classes = [permissions.AllowAny]



class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all() 
    serializer_class = ReservaSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'get_disponibilidad']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]


    @action(detail=False, methods=['get'], url_path='disponibilidad')
    def get_disponibilidad(self, request):
        fecha_checkin_str = request.query_params.get('check_in')
        fecha_checkout_str = request.query_params.get('check_out')

        if not fecha_checkin_str or not fecha_checkout_str:
            return Response({'error': 'Fechas de check-in/out son requeridas (YYYY-MM-DD).'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            fecha_checkin = date.fromisoformat(fecha_checkin_str)
            fecha_checkout = date.fromisoformat(fecha_checkout_str)
        except ValueError:
             return Response({'error': 'Formato de fecha inválido (YYYY-MM-DD).'}, status=status.HTTP_400_BAD_REQUEST)
        
        habitaciones = obtener_habitaciones_disponibles(fecha_checkin, fecha_checkout) 
        
        serializer = HabitacionDisponibleSerializer(habitaciones, many=True)
        return Response(serializer.data)
        
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save() 
        reserva = serializer.instance
        
        transaccion = Transaccion.objects.create(
            reserva=reserva,
            monto=reserva.total_pagado,
            buy_order=reserva.codigo_reserva,
            token_transbank=f"TOKEN-{reserva.codigo_reserva}-{reserva.id}", 
            estado='APROBADO', 
            codigo_autorizacion='AUTH12345'
        )
        
        reserva.estado = 'CONFIRMADA'
        reserva.save()
        
        return Response({
            "message": "Reserva creada y pago simulado como APROBADO.",
            "reserva": serializer.data,
            "transaccion_id": transaccion.id
        }, status=status.HTTP_201_CREATED)