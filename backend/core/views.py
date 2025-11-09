from rest_framework.views import APIView
from rest_framework.response import Response

class HealthCheckAPI(APIView):
    """Proporciona el estado básico del Backend."""
    def get(self, request):
        return Response({
            "status": "online",
            "version": "1.0.0-MVP",
            "environment": "Development",
            "db_status": "connected" 
        })