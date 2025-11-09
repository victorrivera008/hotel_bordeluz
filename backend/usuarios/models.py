from django.db import models
from django.contrib.auth.models import AbstractUser

class Rol(models.Model):
    ROL_CHOICES = (
        (1, 'Administrador'), (2, 'Gerente'),
        (3, 'Recepcionista'), (4, 'Cliente'),
    )
    id = models.PositiveSmallIntegerField(choices=ROL_CHOICES, primary_key=True)
    nombre = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.get_id_display() 

class Usuario(AbstractUser):
    rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True)
    telefono = models.CharField(max_length=20, blank=True)
    
    # FIX: Solución al error de choque (Añadir related_name únicos)
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=('groups'),
        blank=True,
        help_text=('The groups this user belongs to. A user will get all permissions granted to each of their groups.'),
        related_name="usuario_set", 
        related_query_name="usuario",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=('user permissions'),
        blank=True,
        help_text=('Specific permissions for this user.'),
        related_name="usuario_permissions_set", 
        related_query_name="usuario_permission",
    )

    class Meta:
        db_table = 'usuarios_sistema'