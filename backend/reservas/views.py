# backend/reservas/views.py

from datetime import datetime

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from .models import TipoHabitacion, Habitacion, Servicio, Reserva
from .serializers import (
    TipoHabitacionSerializer,
    HabitacionSerializer,
    ServicioSerializer,
    HabitacionDisponibleSerializer,
    ReservaSerializer,
)


# ======================================================
#      FUNCIÓN AUXILIAR: RECALCULAR TOTAL RESERVA
# ======================================================

def recalcular_total_reserva(reserva: Reserva, servicios_data=None):
    """
    Recalcula el total de la reserva en base a:
    - Noches entre fecha_checkin y fecha_checkout
    - Precio base de la habitación (con ajuste por capacidad sobrante)
    - Servicios enviados en servicios_data (lista de {servicio_id, cantidad})
    NO usa reserva.servicios para evitar conflictos con propiedades/listas.
    """
    total = 0

    # Noches
    if reserva.fecha_checkin and reserva.fecha_checkout:
        dias = (reserva.fecha_checkout - reserva.fecha_checkin).days
        noches = max(dias, 0)
    else:
        noches = 0

    # Habitación (si existe)
    if reserva.habitacion and hasattr(reserva.habitacion, "tipo"):
        tipo = reserva.habitacion.tipo
        precio_base = getattr(tipo, "precio_base", 0) or 0
        capacidad_maxima = getattr(tipo, "capacidad_maxima", 0) or 0
        cant_personas = reserva.cantidad_personas or 0

        # Misma lógica que en el frontend: descuento por capacidad sobrante
        diferencia = max(capacidad_maxima - cant_personas, 0)
        descuento = diferencia * 15000
        precio_ajustado = max(precio_base - descuento, 0)

        if noches > 0:
            total += noches * precio_ajustado

    # Servicios desde el payload (si viene)
    if servicios_data:
        # Asegurarnos que es una lista
        if not isinstance(servicios_data, list):
            try:
                # Si por alguna razón viene como string JSON, lo ignoramos por seguridad
                servicios_data = []
            except Exception:
                servicios_data = []

        for item in servicios_data:
            if not isinstance(item, dict):
                continue
            servicio_id = item.get("servicio_id") or item.get("id")
            cantidad = item.get("cantidad", 0) or 0
            if not servicio_id or cantidad <= 0:
                continue

            servicio = Servicio.objects.filter(pk=servicio_id).first()
            if servicio and servicio.precio is not None:
                total += servicio.precio * cantidad

    # Guardar
    # OJO: tu modelo no tiene campo "total", por eso usamos total_pagado
    reserva.total_pagado = total
    reserva.save(update_fields=["total_pagado"])


# ======================================================
#         ENDPOINTS DE CATÁLOGO / CONTENIDO
# ======================================================

@api_view(["GET"])
@permission_classes([AllowAny])
def listar_tipos_habitacion(request):
    tipos = TipoHabitacion.objects.all()
    serializer = TipoHabitacionSerializer(tipos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def listar_habitaciones(request):
    """
    Lista todas las habitaciones, SIEMPRE ordenadas por número (101, 102, ..., 117).
    """
    habitaciones = (
        Habitacion.objects
        .select_related("tipo")
        .all()
        .order_by("numero")
    )
    serializer = HabitacionSerializer(habitaciones, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def listar_servicios(request):
    servicios = Servicio.objects.all()
    serializer = ServicioSerializer(servicios, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ======================================================
#      HABITACIONES DISPONIBLES (BUSCADOR POR FECHA)
# ======================================================

@api_view(["GET"])
@permission_classes([AllowAny])
def habitaciones_disponibles(request):
    """
    Devuelve las habitaciones disponibles entre check-in y check-out.

    Acepta cualquiera de estos nombres de parámetro:
    - fecha_checkin / fecha_checkout
    - check_in / check_out   (usados por el frontend)
    """

    # Soportar ambos nombres de parámetro
    fecha_checkin_str = (
        request.query_params.get("fecha_checkin")
        or request.query_params.get("check_in")
    )
    fecha_checkout_str = (
        request.query_params.get("fecha_checkout")
        or request.query_params.get("check_out")
    )

    if not fecha_checkin_str or not fecha_checkout_str:
        return Response(
            {"detail": "Debe enviar fecha_checkin/fecha_checkout o check_in/check_out."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        fecha_checkin = datetime.strptime(fecha_checkin_str, "%Y-%m-%d").date()
        fecha_checkout = datetime.strptime(fecha_checkout_str, "%Y-%m-%d").date()
    except ValueError:
        return Response(
            {"detail": "Formato de fecha inválido. Use YYYY-MM-DD."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if fecha_checkin >= fecha_checkout:
        return Response(
            {"detail": "La fecha de check-out debe ser posterior al check-in."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # IDs de habitaciones ya reservadas en ese rango
    reservadas_ids = (
        Reserva.objects.filter(
            estado__in=["PENDIENTE", "CONFIRMADA"],
            fecha_checkin__lt=fecha_checkout,
            fecha_checkout__gt=fecha_checkin,
        )
        .values_list("habitacion_id", flat=True)
        .distinct()
    )

    # Habitaciones libres, ordenadas por número
    habitaciones = (
        Habitacion.objects
        .select_related("tipo")
        .exclude(id__in=reservadas_ids)
        .order_by("numero")
    )

    serializer = HabitacionDisponibleSerializer(habitaciones, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ======================================================
#              CREAR RESERVA (CON SERVICIOS)
# ======================================================

@api_view(["POST"])
@permission_classes([AllowAny])  # permite invitado
def crear_reserva(request):
    """
    Crea una reserva con:
    - habitacion
    - fecha_checkin
    - fecha_checkout
    - cantidad_personas
    - servicios: [{ "servicio_id": X, "cantidad": Y }, ...]
    """
    serializer = ReservaSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = request.user if request.user.is_authenticated else None
    reserva = serializer.save(cliente=user)

    # Tomar servicios del request para calcular el total
    servicios_data = request.data.get("servicios", [])
    recalcular_total_reserva(reserva, servicios_data=servicios_data)

    response_data = ReservaSerializer(reserva).data
    return Response(response_data, status=status.HTTP_201_CREATED)


# ======================================================
#           LISTAR RESERVAS DEL USUARIO LOGUEADO
# ======================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mis_reservas(request):
    reservas = Reserva.objects.filter(cliente=request.user).order_by("-fecha_checkin")
    serializer = ReservaSerializer(reservas, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ======================================================
#         LISTAR TODAS LAS RESERVAS (SOLO ADMIN)
# ======================================================



# ======================================================
#                CANCELAR UNA RESERVA
# ======================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancelar_reserva(request, reserva_id):
    try:
        reserva = Reserva.objects.get(pk=reserva_id)
    except Reserva.DoesNotExist:
        return Response(
            {"detail": "Reserva no encontrada."},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Verificar permisos: dueño, staff o recepcionista
    raw_rol = getattr(request.user, "rol", None)
    if raw_rol is None:
        rol_str = ""
    else:
        rol_str = str(raw_rol).strip().lower() if raw_rol else ""
    
    es_staff_o_recepcion = (
        request.user.is_staff or 
        rol_str in ['administrador', 'admin', 'recepcionista', 'recepcion', 'gerencia']
    )

    if reserva.cliente != request.user and not es_staff_o_recepcion:
        return Response(
            {"detail": "No tiene permiso para cancelar esta reserva."},
            status=status.HTTP_403_FORBIDDEN,
        )

    if reserva.estado == "CANCELADA":
        return Response(
            {"detail": "La reserva ya está cancelada."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    reserva.estado = "CANCELADA"
    reserva.save(update_fields=["estado"])

    return Response(
        {"detail": "Reserva cancelada correctamente."},
        status=status.HTTP_200_OK,
    )


# ======================================================
#                ACTUALIZAR UNA RESERVA
# ======================================================

@api_view(["PATCH", "PUT"])
@permission_classes([IsAuthenticated])
def actualizar_reserva(request, reserva_id):
    """
    Permite al usuario logueado modificar su reserva completa.
    - Solo puede editar SUS reservas (o staff).
    - Usa PATCH o PUT.
    """
    import logging
    logger = logging.getLogger(__name__)
    
    logger.info(f"🔍 [ACTUALIZAR_RESERVA] Inicio - Reserva ID: {reserva_id}")
    logger.info(f"🔍 [ACTUALIZAR_RESERVA] Usuario: {request.user.username} (ID: {request.user.id})")
    logger.info(f"🔍 [ACTUALIZAR_RESERVA] Método: {request.method}")
    logger.info(f"🔍 [ACTUALIZAR_RESERVA] Datos recibidos (raw): {request.data}")
    logger.info(f"🔍 [ACTUALIZAR_RESERVA] Tipo de request.data: {type(request.data)}")
    
    try:
        reserva = Reserva.objects.get(pk=reserva_id)
        logger.info(f"🔍 [ACTUALIZAR_RESERVA] Reserva encontrada: {reserva.codigo_reserva}, Estado actual: {reserva.estado}")
    except Reserva.DoesNotExist:
        logger.error(f"❌ [ACTUALIZAR_RESERVA] Reserva {reserva_id} no encontrada")
        return Response(
            {"detail": "Reserva no encontrada."},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Verificar permisos: dueño, staff o recepcionista
    raw_rol = getattr(request.user, "rol", None)
    if raw_rol is None:
        rol_str = ""
    else:
        rol_str = str(raw_rol).strip().lower() if raw_rol else ""
    
    es_staff_o_recepcion = (
        request.user.is_staff or 
        rol_str in ['administrador', 'admin', 'recepcionista', 'recepcion', 'gerencia']
    )
    
    logger.info(f"🔍 [ACTUALIZAR_RESERVA] Rol: '{rol_str}' | is_staff: {request.user.is_staff} | es_staff_o_recepcion: {es_staff_o_recepcion}")
    
    if reserva.cliente != request.user and not es_staff_o_recepcion:
        logger.warning(f"⚠️ [ACTUALIZAR_RESERVA] Sin permisos")
        return Response(
            {"detail": "No tiene permiso para modificar esta reserva."},
            status=status.HTTP_403_FORBIDDEN,
        )

    if reserva.estado == "CANCELADA":
        logger.warning(f"⚠️ [ACTUALIZAR_RESERVA] Intento de modificar reserva cancelada")
        return Response(
            {"detail": "No se puede modificar una reserva cancelada."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Extraer 'estado' del request.data si está presente (el serializer lo rechaza porque es read_only)
    estado_a_actualizar = None
    if es_staff_o_recepcion and 'estado' in request.data:
        estado_a_actualizar = request.data.get('estado')
        logger.info(f"🔍 [ACTUALIZAR_RESERVA] Estado a actualizar: '{estado_a_actualizar}'")
        # Validar que el estado sea uno de los permitidos
        if estado_a_actualizar not in ['PENDIENTE', 'CONFIRMADA', 'CANCELADA']:
            logger.error(f"❌ [ACTUALIZAR_RESERVA] Estado inválido: '{estado_a_actualizar}'")
            return Response(
                {"detail": f"Estado '{estado_a_actualizar}' no es válido. Estados permitidos: PENDIENTE, CONFIRMADA, CANCELADA."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    # Crear una copia mutable de los datos sin 'estado' para el serializer
    # request.data puede ser un QueryDict, así que lo convertimos a dict normal
    data_para_serializer = {}
    for key, value in request.data.items():
        if key != 'estado':
            data_para_serializer[key] = value
    
    logger.info(f"🔍 [ACTUALIZAR_RESERVA] Datos para serializer (sin estado): {data_para_serializer}")

    partial = (request.method == "PATCH")
    logger.info(f"🔍 [ACTUALIZAR_RESERVA] Modo partial: {partial}")
    
    # Si solo estamos actualizando el estado y no hay otros campos, 
    # no necesitamos validar el serializer, solo actualizar el estado directamente
    if estado_a_actualizar and not data_para_serializer:
        logger.info(f"🔍 [ACTUALIZAR_RESERVA] Solo actualizando estado, saltando validación del serializer")
        reserva_actualizada = reserva
    else:
        serializer = ReservaSerializer(
            reserva,
            data=data_para_serializer,
            partial=partial,
        )

        if not serializer.is_valid():
            logger.error(f"❌ [ACTUALIZAR_RESERVA] Errores de validación: {serializer.errors}")
            logger.error(f"❌ [ACTUALIZAR_RESERVA] Datos enviados al serializer: {data_para_serializer}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        logger.info(f"✅ [ACTUALIZAR_RESERVA] Serializer válido, guardando...")

        # Mantener el mismo cliente
        reserva_actualizada = serializer.save(cliente=reserva.cliente)
        logger.info(f"✅ [ACTUALIZAR_RESERVA] Reserva guardada. Estado actual: {reserva_actualizada.estado}")

    # Si hay un estado a actualizar, hacerlo directamente (bypass del serializer)
    if estado_a_actualizar:
        logger.info(f"🔍 [ACTUALIZAR_RESERVA] Actualizando estado a: '{estado_a_actualizar}'")
        reserva_actualizada.estado = estado_a_actualizar
        reserva_actualizada.save()
        logger.info(f"✅ [ACTUALIZAR_RESERVA] Estado actualizado a: '{reserva_actualizada.estado}'")

    # Tomar servicios del request para recalcular el total
    servicios_data = request.data.get("servicios", [])
    logger.info(f"🔍 [ACTUALIZAR_RESERVA] Servicios: {servicios_data}")
    recalcular_total_reserva(reserva_actualizada, servicios_data=servicios_data)
    logger.info(f"✅ [ACTUALIZAR_RESERVA] Total recalculado: {reserva_actualizada.total_pagado}")

    response_data = ReservaSerializer(reserva_actualizada).data
    logger.info(f"✅ [ACTUALIZAR_RESERVA] Respuesta exitosa - Estado final: {reserva_actualizada.estado}")
    return Response(response_data, status=status.HTTP_200_OK)
# ======================================================
#        LISTAR TODAS LAS RESERVAS (SOLO STAFF)
# ======================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def listar_reservas_admin(request):
    """
    Lista TODAS las reservas del sistema.

    Permite acceso si:
    - request.user.is_staff == True  (usuario staff de Django)
    - o el campo 'rol' del usuario (FK u objeto) está dentro de los roles permitidos.
    """
    user = request.user

    # user.rol NO es string, es un objeto (modelo Rol) → lo convertimos a texto
    raw_rol = getattr(user, "rol", None)

    if raw_rol is None:
        rol_str = ""
    else:
        # si es objeto Rol, str(raw_rol) usará su __str__ (por ejemplo "Administrador")
        rol_str = str(raw_rol)
        if rol_str is None:
            rol_str = ""
        rol_str = rol_str.strip().lower()

    # Roles con permiso (en minúsculas)
    ROLES_ADMIN_PERMITIDOS = {"administrador", "admin", "recepcionista", "gerencia"}

    if not (user.is_staff or rol_str in ROLES_ADMIN_PERMITIDOS):
        return Response(
            {"detail": "No tiene permisos de administrador."},
            status=status.HTTP_403_FORBIDDEN,
        )

    reservas = (
        Reserva.objects
        .select_related("habitacion", "cliente", "habitacion__tipo")
        .order_by("-fecha_checkin", "-id")
    )
    serializer = ReservaSerializer(reservas, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)