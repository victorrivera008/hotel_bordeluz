from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from reservas.models import Reserva 
from django.db.models import Sum, Count, Q
from datetime import date, timedelta
import random 


class MongoDataSimulator:
    """Clase para simular la obtención de datos analíticos que vendrían de MongoDB."""
    def get_satisfaccion_promedio(self, periodo):
        return round(random.uniform(4.3, 5.0), 1) 




class DashboardEjecutivoAPI(APIView):
    """
    Combina KPIs Operacionales (MySQL) y Analíticos (Simulación MongoDB).
    Requiere autenticación (JWT) y que el usuario NO sea Cliente.
    """
    permission_classes = [permissions.IsAuthenticated] 
    
    def get(self, request):
        fin_periodo = date.today()
        inicio_periodo = fin_periodo - timedelta(days=30)
        
        
        reservas_en_rango = Reserva.objects.filter(
            fecha_reserva__range=[inicio_periodo, fin_periodo]
        )
        
        datos_mysql = reservas_en_rango.aggregate(
            total_ingresos=Sum('total_pagado', filter=Q(estado__in=['CONFIRMADA', 'CHECKIN', 'CHECKOUT'])),
            total_reservas=Count('id'),
            total_cancelaciones=Count('id', filter=Q(estado='CANCELADA'))
        )
        
        mongo_sim = MongoDataSimulator()
        satisfaccion = mongo_sim.get_satisfaccion_promedio(periodo=(inicio_periodo, fin_periodo))
        
        total_reservas = datos_mysql.get('total_reservas', 0) or 0
        total_cancelaciones = datos_mysql.get('total_cancelaciones', 0) or 0
        
        if total_reservas > 0:
            tasa_cancelacion = f"{((total_cancelaciones / total_reservas) * 100):.2f}%"
        else:
            tasa_cancelacion = "0.00%"
        
        reporte_consolidado = {
            "periodo": f"{inicio_periodo} a {fin_periodo}",
            "kpis_operativos": {
                "ingresos_brutos": datos_mysql.get('total_ingresos', 0) or 0,
                "reservas_totales": total_reservas,
                "tasa_cancelacion": tasa_cancelacion
            },
            "kpis_satisfaccion": {
                "puntuacion_promedio_feedback": satisfaccion,
                "fuente_datos": "Simulación MongoDB"
            }
        }
        
        return Response(reporte_consolidado)