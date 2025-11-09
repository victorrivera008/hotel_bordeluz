from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import Usuario, Rol

class CustomUserAdmin(DefaultUserAdmin):
    """
    Define cómo se muestra el modelo Usuario en el panel de administración, 
    incluyendo el campo 'rol'.
    """
    list_display = DefaultUserAdmin.list_display + ('rol', 'telefono',)
    
    list_filter = DefaultUserAdmin.list_filter + ('rol',)
    
    search_fields = ('username', 'email', 'first_name', 'last_name', 'telefono')
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información Personal', {'fields': ('first_name', 'last_name', 'email', 'telefono')}),
        ('Roles y Permisos', {'fields': ('rol', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas Importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = DefaultUserAdmin.add_fieldsets + (
        (None, {'fields': ('rol', 'telefono')}),
    )

try:
    admin.site.unregister(Usuario)
except admin.sites.NotRegistered:
    pass

admin.site.register(Rol)
admin.site.register(Usuario, CustomUserAdmin)