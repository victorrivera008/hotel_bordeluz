import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const style = {
  container: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#F7F7F7', 
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  header: {
    color: '#4A2A1A', 
    borderBottom: '2px solid #D4AF37', 
    paddingBottom: '10px',
    marginBottom: '30px',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  kpiCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  kpiTitle: {
    color: '#666',
    fontSize: '1rem',
    marginBottom: '5px',
  },
  kpiValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#4A2A1A',
  },
  kpiSubtitle: {
    color: '#D4AF37',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  }
};

const DashboardEjecutivo = () => {
  const { userInfo } = useAuth();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const isStaff = userInfo?.rol !== 'Cliente';

  const formatCLP = (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('es-CL', { 
      style: 'currency', 
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(parseFloat(amount));
  };

  useEffect(() => {
    if (!isStaff) {
      setError('Acceso denegado. Este dashboard es solo para personal autorizado.');
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      try {
        const response = await api.get('/reportes/dashboard/');
        setReporte(response.data);
      } catch (err) {
        setError('No se pudo cargar el reporte. Verifica tu token o permisos.');
        console.error("Error fetching dashboard:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [isStaff, userInfo]);

  if (loading) {
    return <div style={style.container}>Cargando Dashboard...</div>;
  }
  
  if (error) {
    return <div style={style.container}><p style={{color: 'red'}}>{error}</p></div>;
  }

  const kpis = reporte.kpis_operativos;
  const kpiSatisfaccion = reporte.kpis_satisfaccion;

  return (
    <div style={style.container}>
      <h2 style={style.header}>Dashboard Ejecutivo - Resumen Operacional</h2>
      <p>Reporte consolidado del periodo: {reporte.periodo}</p>

      <div style={style.kpiGrid}>
        
        <div style={style.kpiCard}>
          <p style={style.kpiTitle}>Ingresos Brutos (Últimos 30 días)</p>
          <div style={style.kpiValue}>{formatCLP(kpis.ingresos_brutos)}</div>
        </div>

        <div style={style.kpiCard}>
          <p style={style.kpiTitle}>Reservas Totales Confirmadas</p>
          <div style={style.kpiValue}>{kpis.reservas_totales}</div>
        </div>

        <div style={style.kpiCard}>
          <p style={style.kpiTitle}>Puntuación de Satisfacción (Feedback)</p>
          <div style={style.kpiSubtitle}>{kpiSatisfaccion.puntuacion_promedio_feedback} / 5.0</div>
          <p style={{fontSize: '0.8rem', color: '#888'}}>Fuente: {kpiSatisfaccion.fuente_datos}</p>
        </div>
        
        <div style={style.kpiCard}>
          <p style={style.kpiTitle}>Tasa de Cancelación</p>
          <div style={style.kpiValue}>{kpis.tasa_cancelacion}</div>
        </div>
      </div>
      
      <h3 style={{color: '#4A2A1A'}}>Gestión Rápida</h3>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <p>Este panel permite la toma de decisiones informadas sobre precios y estrategias comerciales[cite: 77].</p>
          <p>El RPO (pérdida máxima de 1 hora de datos) y el RTO (máximo de 2 horas de *downtime*) están asegurados por la infraestructura[cite: 203].</p>
      </div>

    </div>
  );
};

export default DashboardEjecutivo;