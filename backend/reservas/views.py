from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Habitacion, Reserva, TipoHabitacion, Servicio, ItemServicioReserva
from .serializers import HabitacionDisponibleSerializer, ReservaSerializer, TipoHabitacionSerializer, ServicioSerializer, HabitacionSerializer
from django.db.models import Q
from datetime import date
from pagos.models import Transaccion 


def obtener_habitaciones_disponibles(fecha_in, fecha_out):
    reservas_conflictivas = Reserva.objects.filter(
        Q(fecha_checkin__lt=fecha_out) & Q(fecha_checkout__gt=fecha_in)
    ).values_list('habitacion_id', flat=True).distinct()
    return Habitacion.objects.filter(~Q(id__in=reservas_conflictivas), estado='LIBRE')

class TipoHabitacionViewSet(viewsets.ModelViewSet):
    queryset = TipoHabitacion.objects.all()
    serializer_class = TipoHabitacionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class HabitacionViewSet(viewsets.ModelViewSet):
    queryset = Habitacion.objects.all()
    serializer_class = HabitacionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all().order_by('-id')
    serializer_class = ReservaSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'get_disponibilidad', 'create']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'], url_path='disponibilidad')
    def get_disponibilidad(self, request):
        fecha_checkin_str = request.query_params.get('check_in')
        fecha_checkout_str = request.query_params.get('check_out')
        if not fecha_checkin_str or not fecha_checkout_str:
            return Response({'error': 'Fechas requeridas.'}, status=400)
        try:
            fecha_checkin = date.fromisoformat(fecha_checkin_str)
            fecha_checkout = date.fromisoformat(fecha_checkout_str)
        except ValueError:
             return Response({'error': 'Formato fecha inválido.'}, status=400)
        habitaciones = obtener_habitaciones_disponibles(fecha_checkin, fecha_checkout) 
        serializer = HabitacionDisponibleSerializer(habitaciones, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mis_reservas(self, request):
        reservas = Reserva.objects.filter(cliente=request.user).order_by('-fecha_checkin')
        serializer = self.get_serializer(reservas, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def agregar_servicios(self, request, pk=None):
        reserva = self.get_object()
        servicios_data = request.data.get('servicios', [])
        
        total_agregado = 0
        for item in servicios_data:
            try:
                servicio = Servicio.objects.get(id=item['servicio_id'])
                item_reserva, created = ItemServicioReserva.objects.get_or_create(
                    reserva=reserva, servicio=servicio,
                    defaults={'precio_unitario': servicio.precio, 'cantidad': 1}
                )
                if not created:
                    pass 
                else:
                    total_agregado += servicio.precio
            except Servicio.DoesNotExist:
                continue
        
        reserva.total_pagado += total_agregado
        reserva.save()
        
        return Response({'status': 'Servicios agregados', 'total_nuevo': reserva.total_pagado})
        
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save() 
        reserva = serializer.instance
        
        transaccion = Transaccion.objects.create(
            reserva=reserva, monto=reserva.total_pagado,
            buy_order=reserva.codigo_reserva, token_transbank=f"TOKEN-{reserva.id}", 
            estado='APROBADO', codigo_autorizacion='AUTH123'
        )
        reserva.estado = 'CONFIRMADA'
        reserva.save()
        
        return Response({
            "message": "Reserva creada exitosamente.",
            "reserva": serializer.data
        }, status=status.HTTP_201_CREATED)