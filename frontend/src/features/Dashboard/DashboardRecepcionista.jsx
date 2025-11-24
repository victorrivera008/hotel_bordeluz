// frontend/src/features/Dashboard/DashboardRecepcionista.jsx

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
  subtitle: {
    marginTop: '15px',
    color: '#4A2A1A',
    fontSize: '1.1rem',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
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
  section: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    color: '#4A2A1A',
    fontFamily: 'Georgia, serif',
    marginBottom: '20px',
    borderBottom: '2px solid #D4AF37',
    paddingBottom: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid #D4AF37',
    backgroundColor: '#F4E8D8',
    color: '#4A2A1A',
    fontWeight: 'bold',
    fontFamily: 'Georgia, serif',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #E0D0C0',
    color: '#4A2A1A',
  },
  badge: (estado) => ({
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    backgroundColor:
      estado === 'CONFIRMADA'
        ? '#d4edda'
        : estado === 'CANCELADA'
        ? '#f8d7da'
        : estado === 'PENDIENTE'
        ? '#fff3cd'
        : estado === 'CHECK-IN'
        ? '#cce5ff'
        : estado === 'CHECK-OUT'
        ? '#e2e3e5'
        : '#e2e3e5',
    color:
      estado === 'CONFIRMADA'
        ? '#155724'
        : estado === 'CANCELADA'
        ? '#721c24'
        : estado === 'PENDIENTE'
        ? '#856404'
        : estado === 'CHECK-IN'
        ? '#004085'
        : estado === 'CHECK-OUT'
        ? '#383d41'
        : '#383d41',
  }),
  button: {
    padding: '6px 12px',
    margin: '0 4px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'opacity 0.3s',
  },
  buttonPrimary: {
    backgroundColor: '#4A2A1A',
    color: 'white',
  },
  buttonSuccess: {
    backgroundColor: '#28a745',
    color: 'white',
  },
  buttonWarning: {
    backgroundColor: '#D4AF37',
    color: '#4A2A1A',
  },
  buttonDanger: {
    backgroundColor: '#dc3545',
    color: 'white',
  },
  actionsSection: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    marginTop: '20px',
  },
  actionButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    backgroundColor: '#D4AF37',
    color: '#4A2A1A',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'opacity 0.3s',
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  successBox: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#4A2A1A',
    padding: '40px',
  },
};

const formatCLP = (amount) => {
  if (amount === null || amount === undefined || isNaN(parseFloat(amount))) return 'N/A';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(parseFloat(amount));
};

const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateString;
  }
};

const getClienteLabel = (reserva) => {
  const d = reserva.cliente_detalle;
  if (d) {
    const nombre = `${d.first_name || ''} ${d.last_name || ''}`.trim();
    if (nombre) return nombre;
    if (d.username) return d.username;
    if (d.email) return d.email;
  }
  if (reserva.cliente) {
    return `Usuario ID ${reserva.cliente}`;
  }
  return 'Reserva como invitado';
};

const getHabitacionLabel = (reserva) => {
  const h = reserva.habitacion_detalle;
  if (h) {
    return `Hab. ${h.numero}${h.tipo_nombre ? ` · ${h.tipo_nombre}` : ''}`.trim();
  }
  if (reserva.habitacion) {
    return `Hab. #${reserva.habitacion}`;
  }
  return 'Sin habitación';
};

const DashboardRecepcionista = ({ onNavigate }) => {
  const { userInfo } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // Validar que el usuario sea recepcionista
  const role = userInfo?.rol?.toString()?.toLowerCase()?.trim() || '';
  // Aceptar tanto "recepcionista" como "recepcion" (el backend puede devolver cualquiera)
  const isRecepcion = role === 'recepcionista' || role === 'recepcion' || role.includes('recepcion');
  
  // Debug: verificar el rol (puedes eliminar esto después)
  if (userInfo?.rol) {
    console.log('🔍 DashboardRecepcionista - Rol detectado:', userInfo.rol, '→ normalizado:', role, '→ isRecepcion:', isRecepcion);
  }

  // Obtener fecha de hoy en formato YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Calcular KPIs desde las reservas
  const calcularKPIs = (reservasData) => {
    const today = getTodayString();

    const llegadasHoy = reservasData.filter(
      (r) => r.fecha_checkin === today && r.estado === 'PENDIENTE'
    ).length;

    const salidasHoy = reservasData.filter(
      (r) => r.fecha_checkout === today && r.estado === 'CHECK-IN'
    ).length;

    const ocupadas = reservasData.filter((r) => r.estado === 'CHECK-IN').length;
    const totalHabitaciones = 24; // Valor por defecto, ajustar según necesidad

    // Simular pagos pendientes: si total_pagado es null o menor que total
    const pagosPendientes = reservasData.filter((r) => {
      const total = r.total_pagado != null ? r.total_pagado : r.total;
      const esperado = r.total;
      return total < esperado || r.estado === 'PENDIENTE';
    }).length;

    return {
      llegadasHoy,
      salidasHoy,
      ocupadas,
      totalHabitaciones,
      pagosPendientes,
    };
  };

  // Filtrar reservas del día de hoy
  const getReservasHoy = (reservasData) => {
    const today = getTodayString();
    return reservasData.filter(
      (r) =>
        r.fecha_checkin === today ||
        r.fecha_checkout === today ||
        (r.fecha_checkin <= today && r.fecha_checkout >= today && r.estado === 'CHECK-IN')
    );
  };

  useEffect(() => {
    if (!userInfo) {
      setLoading(true);
      return;
    }

    if (!isRecepcion) {
      setError('Acceso denegado. Este panel es exclusivo para Recepcionistas.');
      setLoading(false);
      return;
    }

    const fetchReservas = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/reservas/admin/');
        const data = Array.isArray(response.data) ? response.data : [];
        setReservas(data);
      } catch (err) {
        console.error('Error fetching reservas:', err);
        if (err.response?.status === 403) {
          setError('No tienes permisos para acceder a las reservas.');
        } else {
          setError('No se pudieron cargar las reservas. Intenta más tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [isRecepcion, userInfo]);

  // Si no es recepcionista, mostrar mensaje de acceso denegado
  if (!isRecepcion) {
    return (
      <div style={{ ...style.container, textAlign: 'center' }}>
        <p style={{ color: 'red', fontSize: '1.2rem' }}>
          Acceso denegado. Este panel es exclusivo para Recepcionistas.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={style.container}>
        <div style={style.loadingText}>Cargando panel de recepción...</div>
      </div>
    );
  }

  if (error && !reservas.length) {
    return (
      <div style={style.container}>
        <div style={style.errorBox}>Error: {error}</div>
      </div>
    );
  }

  const kpis = calcularKPIs(reservas);
  const reservasHoy = getReservasHoy(reservas);

  // Ordenar reservas del día por hora de check-in
  reservasHoy.sort((a, b) => {
    const timeA = a.fecha_checkin ? new Date(`${a.fecha_checkin}T00:00:00`) : new Date(0);
    const timeB = b.fecha_checkin ? new Date(`${b.fecha_checkin}T00:00:00`) : new Date(0);
    return timeA - timeB;
  });

  const handleVerReserva = (reserva) => {
    console.log('Ver reserva:', reserva);
    // TODO: Implementar vista detallada de reserva
  };

  const handleCheckIn = async (reserva) => {
    // Confirmar acción
    const confirmar = window.confirm(
      `¿Confirmar check-in de la reserva ${reserva.codigo_reserva}?\n\nLa reserva pasará de "${reserva.estado}" a "CONFIRMADA".`
    );
    if (!confirmar) return;

    setProcessingId(reserva.id);
    setError('');
    setSuccessMsg('');

    const payload = {
      estado: 'CONFIRMADA',
    };

    console.log('🔍 [CHECK-IN] Iniciando check-in...');
    console.log('🔍 [CHECK-IN] Reserva ID:', reserva.id);
    console.log('🔍 [CHECK-IN] Código reserva:', reserva.codigo_reserva);
    console.log('🔍 [CHECK-IN] Estado actual:', reserva.estado);
    console.log('🔍 [CHECK-IN] Payload completo:', payload);
    console.log('🔍 [CHECK-IN] URL:', `/reservas/${reserva.id}/actualizar/`);

    try {
      // Actualizar el estado a CONFIRMADA
      const response = await api.patch(`/reservas/${reserva.id}/actualizar/`, payload);
      
      console.log('✅ [CHECK-IN] Respuesta exitosa:', response.data);
      console.log('✅ [CHECK-IN] Estado actualizado a:', response.data.estado);

      // Actualizar la reserva en el estado local
      setReservas((prev) =>
        prev.map((r) => (r.id === reserva.id ? response.data : r))
      );

      setSuccessMsg(`✅ Check-in realizado: Reserva ${reserva.codigo_reserva} confirmada.`);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('❌ [CHECK-IN] Error completo:', err);
      console.error('❌ [CHECK-IN] Error response:', err.response);
      console.error('❌ [CHECK-IN] Error response data:', err.response?.data);
      console.error('❌ [CHECK-IN] Error response status:', err.response?.status);
      console.error('❌ [CHECK-IN] Payload enviado:', payload);
      
      const errorData = err.response?.data;
      let errorMsg = 'No se pudo realizar el check-in. Intenta nuevamente.';
      
      if (errorData) {
        if (errorData.detail) {
          errorMsg = errorData.detail;
        } else if (typeof errorData === 'string') {
          errorMsg = errorData;
        } else if (typeof errorData === 'object') {
          // Si hay errores de validación, mostrarlos
          const errorKeys = Object.keys(errorData);
          if (errorKeys.length > 0) {
            // Formatear errores de manera más legible
            const errorMessages = [];
            for (const key in errorData) {
              if (Array.isArray(errorData[key])) {
                errorMessages.push(`${key}: ${errorData[key].join(', ')}`);
              } else {
                errorMessages.push(`${key}: ${errorData[key]}`);
              }
            }
            errorMsg = errorMessages.join(' | ');
          }
        }
      }
      
      setError(errorMsg);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCheckOut = (reserva) => {
    console.log('Check-out reserva:', reserva);
    // TODO: Implementar check-out
  };

  const handleCancelarReserva = async (reserva) => {
    // Confirmar acción
    const confirmar = window.confirm(
      `¿Estás seguro de cancelar la reserva ${reserva.codigo_reserva}?\n\nEsta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    setProcessingId(reserva.id);
    setError('');
    setSuccessMsg('');

    console.log('🔍 [CANCELAR] Iniciando cancelación...');
    console.log('🔍 [CANCELAR] Reserva ID:', reserva.id);
    console.log('🔍 [CANCELAR] Código reserva:', reserva.codigo_reserva);
    console.log('🔍 [CANCELAR] Estado actual:', reserva.estado);

    try {
      // Cancelar la reserva
      const response = await api.post(`/reservas/${reserva.id}/cancelar/`);
      
      console.log('✅ [CANCELAR] Respuesta exitosa:', response.data);

      // Actualizar la reserva en el estado local
      setReservas((prev) =>
        prev.map((r) => 
          r.id === reserva.id ? { ...r, estado: 'CANCELADA' } : r
        )
      );

      setSuccessMsg(`✅ Reserva ${reserva.codigo_reserva} cancelada correctamente.`);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('❌ [CANCELAR] Error completo:', err);
      console.error('❌ [CANCELAR] Error response:', err.response);
      console.error('❌ [CANCELAR] Error response data:', err.response?.data);
      
      const errorData = err.response?.data;
      let errorMsg = 'No se pudo cancelar la reserva. Intenta nuevamente.';
      
      if (errorData) {
        if (errorData.detail) {
          errorMsg = errorData.detail;
        } else if (typeof errorData === 'string') {
          errorMsg = errorData;
        }
      }
      
      setError(errorMsg);
    } finally {
      setProcessingId(null);
    }
  };

  const handleNuevaReserva = () => {
    console.log('Ir a nueva reserva');
    if (onNavigate) {
      onNavigate('ReservasAdmin');
    }
  };

  const handleVerTodasReservas = () => {
    if (onNavigate) {
      onNavigate('ReservasAdmin');
    }
  };

  return (
    <div style={style.container}>
      <div style={style.header}>
        <h1 style={style.title}>Panel de Recepción</h1>
        <p style={style.subtitle}>Gestión diaria de reservas del Hotel Bordeluz</p>
      </div>

      {/* KPIs */}
      <div style={style.kpiGrid}>
        <div style={style.kpiCard}>
          <p style={style.kpiTitle}>Llegadas de hoy</p>
          <div style={style.kpiValue}>{kpis.llegadasHoy}</div>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
            Check-in pendientes
          </p>
        </div>

        <div style={style.kpiCard}>
          <p style={style.kpiTitle}>Salidas de hoy</p>
          <div style={style.kpiValue}>{kpis.salidasHoy}</div>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
            Check-out pendientes
          </p>
        </div>

        <div style={style.kpiCard}>
          <p style={style.kpiTitle}>Habitaciones ocupadas</p>
          <div style={style.kpiValue}>
            {kpis.ocupadas} / {kpis.totalHabitaciones}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
            Ocupación actual
          </p>
        </div>

        <div style={style.kpiCard}>
          <p style={style.kpiTitle}>Reservas con pago pendiente</p>
          <div style={style.kpiValue}>{kpis.pagosPendientes}</div>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
            Requieren atención
          </p>
        </div>
      </div>

      {/* Tabla de reservas del día */}
      <div style={style.section}>
        <h2 style={style.sectionTitle}>Reservas de hoy</h2>
        {error && <div style={style.errorBox}>{error}</div>}
        {successMsg && <div style={style.successBox}>{successMsg}</div>}
        {reservasHoy.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
            No hay reservas programadas para hoy.
          </p>
        ) : (
          <table style={style.table}>
            <thead>
              <tr>
                <th style={style.th}>Hora</th>
                <th style={style.th}>Huésped</th>
                <th style={style.th}>Habitación</th>
                <th style={style.th}>Estado</th>
                <th style={style.th}>Total</th>
                <th style={style.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasHoy.map((reserva) => {
                const total = reserva.total_pagado != null ? reserva.total_pagado : reserva.total;
                return (
                  <tr key={reserva.id}>
                    <td style={style.td}>{formatTime(reserva.fecha_checkin)}</td>
                    <td style={style.td}>{getClienteLabel(reserva)}</td>
                    <td style={style.td}>{getHabitacionLabel(reserva)}</td>
                    <td style={style.td}>
                      <span style={style.badge(reserva.estado)}>{reserva.estado}</span>
                    </td>
                    <td style={style.td}>{formatCLP(total)}</td>
                    <td style={style.td}>
                      {/* Botón Check-in: solo para PENDIENTE, deshabilitado si es CONFIRMADA */}
                      {reserva.estado === 'PENDIENTE' && (
                        <button
                          onClick={() => handleCheckIn(reserva)}
                          disabled={processingId === reserva.id}
                          style={{
                            ...style.button,
                            ...style.buttonSuccess,
                            opacity: processingId === reserva.id ? 0.6 : 1,
                            cursor: processingId === reserva.id ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {processingId === reserva.id ? 'Procesando...' : 'Check-in'}
                        </button>
                      )}
                      {/* Botón Check-in deshabilitado si ya está CONFIRMADA */}
                      {reserva.estado === 'CONFIRMADA' && (
                        <button
                          disabled
                          style={{
                            ...style.button,
                            ...style.buttonSuccess,
                            opacity: 0.5,
                            cursor: 'not-allowed',
                          }}
                          title="Check-in ya realizado"
                        >
                          Check-in ✓
                        </button>
                      )}
                      {/* Botón Check-out para reservas en CHECK-IN */}
                      {reserva.estado === 'CHECK-IN' && (
                        <button
                          onClick={() => handleCheckOut(reserva)}
                          style={{ ...style.button, ...style.buttonWarning }}
                        >
                          Check-out
                        </button>
                      )}
                      {/* Botón Cancelar: disponible para PENDIENTE y CONFIRMADA, no para CANCELADA */}
                      {reserva.estado !== 'CANCELADA' && (
                        <button
                          onClick={() => handleCancelarReserva(reserva)}
                          disabled={processingId === reserva.id}
                          style={{
                            ...style.button,
                            ...style.buttonDanger,
                            opacity: processingId === reserva.id ? 0.6 : 1,
                            cursor: processingId === reserva.id ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {processingId === reserva.id ? 'Procesando...' : 'Cancelar'}
                        </button>
                      )}
                      {/* Mostrar estado si está cancelada */}
                      {reserva.estado === 'CANCELADA' && (
                        <span style={{ color: '#721c24', fontSize: '0.85rem', fontStyle: 'italic' }}>
                          Cancelada
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Acciones rápidas */}
    </div>
  );
};

export default DashboardRecepcionista;

