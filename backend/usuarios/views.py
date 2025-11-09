from django.contrib.auth import authenticate
from rest_framework import views, response, status, exceptions, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer 

from .serializers import RegistroSerializer 
from .models import Usuario 



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer to fix the 401 Unauthorized error by removing the is_staff check.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_id'] = user.id
        token['rol'] = user.rol.nombre if user.rol else 'No Role' 
        return token

    def validate(self, attrs):
        """
        Overrides validation to use authenticate() without checking user.is_staff.
        """
        authenticate_kwargs = {
            'username': attrs['username'], 
            'password': attrs['password']
        }
        
        user = authenticate(**authenticate_kwargs)

        if user is None:
            raise exceptions.AuthenticationFailed(
                'No se encontró una cuenta activa con las credenciales proporcionadas.', 
                code='no_account'
            )

        if not user.is_active:
            raise exceptions.AuthenticationFailed(
                'Esta cuenta está inactiva.', 
                code='inactive_account'
            )
        
        refresh = self.get_token(user)
        data = {}
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        
        data['user_id'] = user.id
        data['rol'] = user.rol.nombre if user.rol else 'No Role'

        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    """View that exposes the login endpoint."""
    serializer_class = CustomTokenObtainPairSerializer



class RegistroUsuarioAPIView(views.APIView):
    """Allows public user registration (role 'Cliente')."""
    permission_classes = [permissions.AllowAny] 

    def post(self, request):
        serializer = RegistroSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            response_data = RegistroSerializer(user).data
            return response.Response(response_data, status=status.HTTP_201_CREATED)
        
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)