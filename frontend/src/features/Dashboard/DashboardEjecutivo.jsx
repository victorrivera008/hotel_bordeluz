// src/features/Dashboard/DashboardEjecutivo.jsx

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const style = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px',
    backgroundColor: '#F4E8D8',
    minHeight: '80vh',
  },
  header: {
    textAlign: 'center',
    color: '#4A2A1A',
    marginBottom: '50px',
  },
  title: {
    fontSize: '3rem',
    borderBottom: '3px solid #D4AF37',
    display: 'inline-block',
    paddingBottom: '10px',
    fontFamily: 'Georgia, serif',
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
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
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
  },
};

const DashboardEjecutivo = () => {
  const { userInfo } = useAuth();
  const [reporte, setReporte] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Misma lógica de STAFF que en App.jsx
  const isStaff = !!(
    userInfo &&
    (userInfo.is_staff === true ||
      userInfo.rol === 'Administrador' ||
      userInfo.rol === 'Recepcionista')
  );

  const formatCLP = (amount) => {
    if (amount === null || amount === undefined || isNaN(parseFloat(amount))) return 'N/A';
    return new Intl.NumberFormat('es-CL', { 
      style: 'currency', 
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(parseFloat(amount));
  };

  useEffect(() => {
    if (!userInfo) {
      setLoading(true);
      return;
    }

    if (!isStaff) {
      setError('Acceso denegado. Este dashboard es solo para personal autorizado.');
      setLoading(false);   // 👈 importante: false en minúscula
      return;
    }

    const fetchReport = async () => {
      try {
        const response = await api.get('/reportes/dashboard/');
        setReporte(response.data);
      } catch (err) {
        setError('No se pudo cargar el reporte. Verifica tu token o permisos.');
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [isStaff, userInfo]);

  if (!isStaff) {
    return (
      <div style={{...style.container, textAlign: 'center'}}>
        <p style={{color: 'red', fontSize: '1.2rem'}}>
          Acceso denegado. Este dashboard es solo para personal autorizado.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{...style.container, textAlign: 'center'}}>
        <p style={{color: 'red', fontSize: '1.2rem'}}>Error: {error}</p>
      </div>
    );
  }

  if (loading || !reporte) {
    return (
      <div style={{...style.container, textAlign: 'center', fontSize: '1.5rem'}}>
        Cargando Dashboard...
      </div>
    );
  }
  
  const kpis = reporte.kpis_operativos;
  const kpiSatisfaccion = reporte.kpis_satisfaccion;

  return (
    <div style={style.container}>
      <div style={style.header}>
        <h1 style={style.title}>Dashboard Ejecutivo</h1>
        <p style={{ marginTop: '15px', color: '#4A2A1A' }}>
          Resumen operacional del periodo: {reporte.periodo}
        </p>
      </div>

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
          <div style={style.kpiSubtitle}>
            {kpiSatisfaccion.puntuacion_promedio_feedback} / 5.0
          </div>
          <p style={{fontSize: '0.8rem', color: '#888'}}>
            Fuente: {kpiSatisfaccion.fuente_datos}
          </p>
        </div>
        
        <div style={style.kpiCard}>
          <p style={style.kpiTitle}>Tasa de Cancelación</p>
          <div style={style.kpiValue}>{kpis.tasa_cancelacion}</div>
        </div>
      </div>
      
      <h3 style={{color: '#4A2A1A', textAlign: 'center', marginTop: '40px'}}>
        Gestión Rápida
      </h3>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <p>
          Este panel permite la toma de decisiones informadas sobre precios y estrategias comerciales.
        </p>
      </div>
    </div>
  );
};

export default DashboardEjecutivo;
