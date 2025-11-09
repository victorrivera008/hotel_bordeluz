# backend/usuarios/signals.py

from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from usuarios.models import Rol 
from reservas.models import Reserva, Habitacion, Servicio, TipoHabitacion
from pagos.models import Transaccion

def asignar_permisos_a_grupos(sender, **kwargs):
    modelos_clave = {
        'reserva': Reserva,
        'habitacion': Habitacion,
        'servicio': Servicio,
        'tipohabitacion': TipoHabitacion,
        'transaccion': Transaccion,
    }

 
    grupos_y_permisos = {

        "huespedes": [
            'add_reserva', 'change_reserva', 'view_reserva', 
            'view_servicio', 'view_tipohabitacion', 
        ],
        "recepcionista": [
            'add_reserva', 'change_reserva', 'delete_reserva', 'view_reserva',
            'change_habitacion', 'view_habitacion', 
            'add_transaccion', 'view_transaccion', 
        ],
    }

    for nombre_grupo, codigos_permiso in grupos_y_permisos.items():
        grupo, creado = Group.objects.get_or_create(name=nombre_grupo)

        if creado:
            print(f"--- GRUPO CREADO AUTOMÁTICAMENTE: {nombre_grupo} ---")

        for codigo_permiso in codigos_permiso:
            accion, modelo_nombre = codigo_permiso.split('_', 1)

            if modelo_nombre in modelos_clave:
                modelo = modelos_clave[modelo_nombre]
                
                try:
                    permiso = Permission.objects.get(
                        content_type__app_label='reservas', 
                        codename=codigo_permiso
                    )
                except Permission.DoesNotExist:
                     try:
                        content_type = ContentType.objects.get_for_model(modelo)
                        permiso = Permission.objects.get(
                             content_type=content_type, 
                             codename=codigo_permiso
                        )
                     except Permission.DoesNotExist:
                         continue 

                grupo.permissions.add(permiso)
                print(f"   -> Asignado permiso: {codigo_permiso}")

@receiver(post_migrate)
def crear_grupos_y_permisos_automaticos(sender, **kwargs):
    if sender.name == 'usuarios':
        asignar_permisos_a_grupos(sender, **kwargs)