// src/features/Booking/MyBookingsPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaUserCircle,
  FaConciergeBell,
} from 'react-icons/fa';

const style = {
  page: {
    minHeight: '70vh',
    background: 'linear-gradient(135deg, #f4e8d8 0%, #f9f3ea 100%)',
    padding: '40px 20px 70px',
    fontFamily: 'Georgia, serif',
  },
  wrapper: {
    maxWidth: '1150px',
    margin: '0 auto',
  },
  headerCard: {
    background: '#fff7e9',
    borderRadius: '18px',
    padding: '18px 20px',
    marginBottom: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    border: '1px solid #f0dec4',
  },
  iconCircle: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#D4AF37,#c49b2e)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: '1.9rem',
    color: '#4A2A1A',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#7a5b3f',
    marginTop: '4px',
  },
  headerBadge: {
    padding: '6px 12px',
    borderRadius: '999px',
    background: '#ffffff',
    border: '1px solid #e3d6c2',
    fontSize: '0.8rem',
    color: '#6a4832',
    whiteSpace: 'nowrap',
  },
  card: {
    background: '#ffffff',
    borderRadius: '18px',
    boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
    padding: '22px 22px 24px',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
    marginTop: '4px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
    minWidth: '760px',
  },
  th: {
    textAlign: 'left',
    padding: '10px 10px',
    borderBottom: '1px solid #e3d6c2',
    background: '#faf3e4',
    fontWeight: 'bold',
    color: '#5b3a26',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '9px 10px',
    borderBottom: '1px solid #f1e4d4',
    color: '#4a2a1a',
    verticalAlign: 'middle',
  },
  rowStriped: (index) => ({
    backgroundColor: index % 2 === 0 ? '#fff' : '#fffbf4',
  }),
  codeChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 9px',
    borderRadius: '999px',
    backgroundColor: '#f5ecdd',
    border: '1px solid #e2cfb3',
    fontSize: '0.8rem',
    color: '#4A2A1A',
  },
  badgeEstado: (tipo) => ({
    display: 'inline-block',
    padding: '4px 9px',
    borderRadius: '999px',
    fontSize: '0.75rem',
    background:
      tipo === 'CONFIRMADA'
        ? '#d4edda'
        : tipo === 'CANCELADA'
        ? '#f8d7da'
        : '#fff3cd',
    color:
      tipo === 'CONFIRMADA'
        ? '#155724'
        : tipo === 'CANCELADA'
        ? '#721c24'
        : '#856404',
    border:
      tipo === 'CONFIRMADA'
        ? '1px solid #c3e6cb'
        : tipo === 'CANCELADA'
        ? '1px solid #f5c6cb'
        : '1px solid #ffeeba',
  }),
  buttonIcon: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: '4px 6px',
    borderRadius: '999px',
    transition: 'background 0.15s ease, transform 0.1s ease',
  },
  buttonIconInner: (variant = 'default') => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '26px',
    height: '26px',
    borderRadius: '999px',
    background: variant === 'danger' ? '#f7c8c8' : '#f3e3c9',
    color: variant === 'danger' ? '#7a1d1d' : '#4A2A1A',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  }),
  emptyState: {
    padding: '18px 12px',
    textAlign: 'center',
    fontSize: '0.92rem',
    color: '#6a4832',
  },
  smallHint: {
    marginTop: '6px',
    fontSize: '0.8rem',
    color: '#8a6a4a',
  },
  panelEdicion: {
    marginTop: '22px',
    paddingTop: '16px',
    borderTop: '1px dashed #e0cda9',
  },
  panelTitle: {
    fontSize: '1.05rem',
    color: '#4A2A1A',
    marginBottom: '6px',
  },
  formRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '10px',
  },
  formGroup: {
    flex: '1 1 170px',
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    color: '#4A2A1A',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '7px 9px',
    borderRadius: '9px',
    border: '1px solid #d0b89c',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    boxSizing: 'border-box',
    background: '#fffcf7',
  },
  select: {
    width: '100%',
    padding: '7px 9px',
    borderRadius: '9px',
    border: '1px solid #d0b89c',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    boxSizing: 'border-box',
    background: '#fffcf7',
  },
  infoTotal: {
    marginTop: '8px',
    fontSize: '0.9rem',
    color: '#4A2A1A',
  },
  accionesEdicion: {
    marginTop: '12px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  btnGuardar: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    border: 'none',
    borderRadius: '999px',
    padding: '8px 16px',
    background: 'linear-gradient(90deg,#D4AF37,#c49b2e)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.86rem',
    boxShadow: '0 6px 14px rgba(0,0,0,0.18)',
  },
  btnCancelar: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: '999px',
    padding: '8px 16px',
    border: '1px solid #b8b8b8',
    background: '#fff',
    color: '#555',
    cursor: 'pointer',
    fontSize: '0.86rem',
  },
  errorBox: {
    marginBottom: '10px',
    padding: '9px 11px',
    borderRadius: '10px',
    background: '#f8d7da',
    color: '#721c24',
    fontSize: '0.85rem',
    border: '1px solid #f5c6cb',
  },
  successBox: {
    marginBottom: '10px',
    padding: '9px 11px',
    borderRadius: '10px',
    background: '#d4edda',
    color: '#155724',
    fontSize: '0.85rem',
    border: '1px solid #c3e6cb',
  },
  loadingText: {
    padding: '10px 4px',
    fontSize: '0.9rem',
    color: '#6a4832',
  },

  serviciosBox: {
    marginTop: '10px',
    padding: '10px 12px',
    borderRadius: '12px',
    border: '1px solid #ead7be',
    background: '#fffbf4',
  },
  serviciosHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    color: '#4A2A1A',
    marginBottom: '6px',
  },
  serviciosHint: {
    fontSize: '0.78rem',
    color: '#8a6a4a',
    marginBottom: '8px',
  },
  servicioRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#4A2A1A',
    marginBottom: '6px',
    gap: '10px',
  },
  servicioNombre: {
    flex: 1,
  },
  servicioPrecio: {
    minWidth: '110px',
    textAlign: 'right',
  },
  servicioInput: {
    width: '60px',
    padding: '4px 6px',
    borderRadius: '7px',
    border: '1px solid #d0b89c',
    fontSize: '0.85rem',
    textAlign: 'center',
    background: '#fffdfa',
  },
};

const formatCLP = (amount) => {
  if (amount == null || isNaN(amount)) return '—';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(Number(amount));
};

// Intenta adivinar id y cantidad desde distintos formatos de serializer
const extraerServicioId = (item) =>
  item?.servicio_id ||
  item?.servicio?.id ||
  item?.id_servicio ||
  item?.servicioId ||
  null;

const extraerCantidadServicio = (item) =>
  item?.cantidad ?? item?.qty ?? item?.cant ?? 0;

const MyBookingsPage = () => {
  const { isAuthenticated } = useAuth();

  const [reservas, setReservas] = useState([]);
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]); // 👈 SOLO disponibles
  const [serviciosCatalogo, setServiciosCatalogo] = useState([]);
  const [serviciosEditados, setServiciosEditados] = useState({}); // { servicioId: cantidad }

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [reservaEditando, setReservaEditando] = useState(null);

  // ---------- Cargar reservas del usuario ----------
  useEffect(() => {
    const fetchMisReservas = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setErrorMsg(null);
        const resp = await api.get('/reservas/mis/');
        setReservas(Array.isArray(resp.data) ? resp.data : []);
      } catch (err) {
        console.error('Error cargando mis reservas:', err);
        setErrorMsg(
          'No fue posible cargar tus reservas. Intenta nuevamente en unos minutos.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMisReservas();
  }, [isAuthenticated]);

  // ---------- Cargar catálogo de servicios ----------
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const resp = await api.get('/servicios/');
        setServiciosCatalogo(Array.isArray(resp.data) ? resp.data : []);
      } catch (err) {
        console.error('Error cargando servicios:', err);
      }
    };
    fetchServicios();
  }, []);

  // 🔹 Función para cargar SOLO habitaciones DISPONIBLES según fechas
  async function fetchHabitacionesDisponibles(fecha_checkin, fecha_checkout, reservaRef) {
    if (!fecha_checkin || !fecha_checkout) return;
    try {
      const resp = await api.get('/reservas/disponibilidad/', {
        params: {
          check_in: fecha_checkin,
          check_out: fecha_checkout,
        },
      });

      let lista = Array.isArray(resp.data) ? resp.data : [];

      // Incluir la habitación actual de la reserva si no viene en la lista
      if (reservaRef?.habitacion) {
        const existe = lista.some(
          (h) => String(h.id) === String(reservaRef.habitacion)
        );
        if (!existe) {
          lista = [
            {
              id: reservaRef.habitacion,
              numero:
                reservaRef.habitacion_detalle?.numero || reservaRef.habitacion,
              tipo_detalle: reservaRef.habitacion_detalle
                ? { nombre: reservaRef.habitacion_detalle.tipo_nombre }
                : null,
            },
            ...lista,
          ];
        }
      }

      setHabitacionesDisponibles(lista);
    } catch (err) {
      console.error('Error cargando habitaciones disponibles:', err);
      // Si falla, no rompemos la UI
    }
  }

  // Inicializa el mapa de serviciosEditados desde la reserva actual
  const inicializarServiciosDesdeReserva = (reserva) => {
    const mapa = {};
    if (Array.isArray(reserva.servicios)) {
      reserva.servicios.forEach((item) => {
        const sId = extraerServicioId(item);
        const cant = extraerCantidadServicio(item);
        if (sId && cant > 0) {
          mapa[sId] = cant;
        }
      });
    }
    return mapa;
  };

  const manejarClickEditar = (reserva) => {
    setReservaEditando({ ...reserva });
    setServiciosEditados(inicializarServiciosDesdeReserva(reserva));
    setErrorMsg(null);
    setSuccessMsg(null);

    // 🔹 Cargar habitaciones disponibles para las fechas de ESTA reserva
    fetchHabitacionesDisponibles(
      reserva.fecha_checkin,
      reserva.fecha_checkout,
      reserva
    );
  };

  const manejarCambioCampo = (campo, valor) => {
    setReservaEditando((prev) => {
      if (!prev) return prev;
      const actualizado = { ...prev, [campo]: valor };

      // Si se cambian fechas, vuelvo a consultar habitaciones disponibles
      if (
        (campo === 'fecha_checkin' || campo === 'fecha_checkout') &&
        actualizado.fecha_checkin &&
        actualizado.fecha_checkout
      ) {
        fetchHabitacionesDisponibles(
          actualizado.fecha_checkin,
          actualizado.fecha_checkout,
          actualizado
        );
      }

      return actualizado;
    });
  };

  const manejarCantidadServicio = (servicioId, valor) => {
    const num = parseInt(valor, 10);
    setServiciosEditados((prev) => {
      const copia = { ...prev };
      if (isNaN(num) || num <= 0) {
        // eliminar servicio si es 0 o vacío
        delete copia[servicioId];
      } else {
        copia[servicioId] = num;
      }
      return copia;
    });
  };

  const manejarGuardarCambios = async () => {
    if (!reservaEditando) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const serviciosPayload = Object.entries(serviciosEditados).map(
        ([servicioId, cantidad]) => ({
          servicio_id: Number(servicioId),
          cantidad,
        })
      );

      const payload = {
        habitacion: reservaEditando.habitacion,
        fecha_checkin: reservaEditando.fecha_checkin,
        fecha_checkout: reservaEditando.fecha_checkout,
        cantidad_personas: reservaEditando.cantidad_personas,
        servicios: serviciosPayload,
      };

      const res = await api.patch(
        `/reservas/${reservaEditando.id}/actualizar/`,
        payload
      );

      const reservaActualizada = res.data; // incluye total_pagado nuevo

      setReservas((prev) =>
        prev.map((r) => (r.id === reservaActualizada.id ? reservaActualizada : r))
      );

      setReservaEditando(reservaActualizada);
      setServiciosEditados(inicializarServiciosDesdeReserva(reservaActualizada));

      setSuccessMsg('La reserva se ha actualizado correctamente.');
    } catch (err) {
      console.error('Error actualizando reserva:', err);
      if (err.response?.data) {
        const data = err.response.data;
        const msg =
          typeof data === 'string'
            ? data
            : data.detail || data.error || data.message || JSON.stringify(data, null, 2);
        setErrorMsg(msg);
      } else {
        setErrorMsg('Ocurrió un error al actualizar la reserva. Inténtalo nuevamente.');
      }
    }
  };

  const manejarCancelarEdicion = () => {
    setReservaEditando(null);
    setServiciosEditados({});
    setHabitacionesDisponibles([]);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // ---------- Cancelar reserva ----------
  const manejarCancelarReserva = async (reserva) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas cancelar la reserva ${reserva.codigo_reserva}?`
    );
    if (!confirmar) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await api.post(`/reservas/${reserva.id}/cancelar/`);

      setReservas((prev) =>
        prev.map((r) =>
          r.id === reserva.id ? { ...r, estado: 'CANCELADA' } : r
        )
      );

      setReservaEditando((prev) =>
        prev && prev.id === reserva.id ? { ...prev, estado: 'CANCELADA' } : prev
      );

      setSuccessMsg('La reserva ha sido cancelada correctamente.');
    } catch (err) {
      console.error('Error cancelando reserva:', err);
      if (err.response?.data) {
        const data = err.response.data;
        const msg =
          typeof data === 'string'
            ? data
            : data.detail || data.error || data.message || JSON.stringify(data, null, 2);
        setErrorMsg(msg);
      } else {
        setErrorMsg('Ocurrió un error al cancelar la reserva. Inténtalo nuevamente.');
      }
    }
  };

  // ================== RENDER ==================

  if (!isAuthenticated) {
    return (
      <div style={style.page}>
        <div style={style.wrapper}>
          <div style={style.headerCard}>
            <div style={style.iconCircle}>
              <FaUserCircle />
            </div>
            <div style={style.titleBlock}>
              <h1 style={style.title}>Mis reservas</h1>
              <p style={style.subtitle}>
                Inicia sesión para revisar, gestionar y modificar tus reservas en el hotel.
              </p>
            </div>
          </div>

          <div style={style.card}>
            <p style={style.emptyState}>
              Actualmente no hay información disponible porque no has iniciado sesión.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={style.page}>
      <div style={style.wrapper}>
        {/* CABECERA */}
        <div style={style.headerCard}>
          <div style={style.iconCircle}>
            <FaCalendarAlt />
          </div>
          <div style={style.titleBlock}>
            <h1 style={style.title}>Mis reservas</h1>
            <p style={style.subtitle}>
              Revisa el detalle de tus estancias y actualiza fechas, habitación, número de personas
              o servicios adicionales en reservas activas.
            </p>
          </div>
          <div style={style.headerBadge}>
            {reservas.length === 0
              ? 'Sin reservas activas'
              : `${reservas.length} reserva${reservas.length > 1 ? 's' : ''} registrada${reservas.length > 1 ? 's' : ''}`}
          </div>
        </div>

        {/* CUERPO PRINCIPAL */}
        <div style={style.card}>
          {errorMsg && <div style={style.errorBox}>{errorMsg}</div>}
          {successMsg && <div style={style.successBox}>{successMsg}</div>}

          {loading ? (
            <p style={style.loadingText}>Cargando tus reservas...</p>
          ) : reservas.length === 0 ? (
            <div style={style.emptyState}>
              No tienes reservas registradas por el momento.
              <div style={style.smallHint}>
                Puedes realizar una nueva reserva desde la sección <strong>“Reserva online”</strong>.
              </div>
            </div>
          ) : (
            <>
              <div style={style.tableContainer}>
                <table style={style.table}>
                  <thead>
                    <tr>
                      <th style={style.th}>Código</th>
                      <th style={style.th}>Habitación</th>
                      <th style={style.th}>Check-in</th>
                      <th style={style.th}>Check-out</th>
                      <th style={style.th}>Personas</th>
                      <th style={style.th}>Estado</th>
                      <th style={style.th}>Total pagado</th>
                      <th style={style.th}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map((reserva, index) => (
                      <tr key={reserva.id} style={style.rowStriped(index)}>
                        <td style={style.td}>
                          <span style={style.codeChip}>
                            <FaCalendarAlt size={11} />
                            {reserva.codigo_reserva}
                          </span>
                        </td>
                        <td style={style.td}>
                          {reserva.habitacion_detalle
                            ? `Hab. ${reserva.habitacion_detalle.numero} · ${reserva.habitacion_detalle.tipo_nombre}`
                            : reserva.habitacion || '—'}
                        </td>
                        <td style={style.td}>{reserva.fecha_checkin}</td>
                        <td style={style.td}>{reserva.fecha_checkout}</td>
                        <td style={style.td}>{reserva.cantidad_personas}</td>
                        <td style={style.td}>
                          <span style={style.badgeEstado(reserva.estado)}>
                            {reserva.estado}
                          </span>
                        </td>
                        <td style={style.td}>{formatCLP(reserva.total_pagado)}</td>
                        <td style={style.td}>
                          {reserva.estado !== 'CANCELADA' && (
                            <>
                              <button
                                style={style.buttonIcon}
                                onClick={() => manejarClickEditar(reserva)}
                                title="Editar reserva"
                              >
                                <span style={style.buttonIconInner('default')}>
                                  <FaEdit size={13} />
                                </span>
                              </button>
                              <button
                                style={style.buttonIcon}
                                onClick={() => manejarCancelarReserva(reserva)}
                                title="Cancelar reserva"
                              >
                                <span style={style.buttonIconInner('danger')}>
                                  <FaTimes size={13} />
                                </span>
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={style.smallHint}>
                Solo puedes modificar o cancelar reservas con estado <strong>Pendiente</strong> o{' '}
                <strong>Confirmada</strong>. Las reservas canceladas se mantienen como registro histórico.
              </p>
            </>
          )}

          {/* Panel de edición */}
          {reservaEditando && (
            <div style={style.panelEdicion}>
              <div style={style.panelTitle}>
                Editando reserva <strong>{reservaEditando.codigo_reserva}</strong>
              </div>

              {/* Datos básicos */}
              <div style={style.formRow}>
                <div style={style.formGroup}>
                  <label style={style.label}>Habitación (solo disponibles)</label>
                  <select
                    style={style.select}
                    value={reservaEditando.habitacion || ''}
                    onChange={(e) =>
                      manejarCambioCampo(
                        'habitacion',
                        e.target.value ? parseInt(e.target.value, 10) : null
                      )
                    }
                  >
                    <option value="">Selecciona una habitación</option>
                    {habitacionesDisponibles.map((h) => (
                      <option key={h.id} value={h.id}>
                        Hab. {h.numero}{' '}
                        {h.tipo_detalle?.nombre ? `· ${h.tipo_detalle.nombre}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={style.formGroup}>
                  <label style={style.label}>Fecha check-in</label>
                  <input
                    type="date"
                    style={style.input}
                    value={reservaEditando.fecha_checkin || ''}
                    onChange={(e) => manejarCambioCampo('fecha_checkin', e.target.value)}
                  />
                </div>
                <div style={style.formGroup}>
                  <label style={style.label}>Fecha check-out</label>
                  <input
                    type="date"
                    style={style.input}
                    value={reservaEditando.fecha_checkout || ''}
                    onChange={(e) => manejarCambioCampo('fecha_checkout', e.target.value)}
                  />
                </div>
                <div style={style.formGroup}>
                  <label style={style.label}>Cantidad de personas</label>
                  <input
                    type="number"
                    min="1"
                    style={style.input}
                    value={reservaEditando.cantidad_personas || 1}
                    onChange={(e) =>
                      manejarCambioCampo(
                        'cantidad_personas',
                        parseInt(e.target.value || '1', 10)
                      )
                    }
                  />
                </div>
              </div>

              {/* Servicios adicionales */}
              <div style={style.serviciosBox}>
                <div style={style.serviciosHeader}>
                  <FaConciergeBell />
                  <span>Servicios adicionales</span>
                </div>
                <div style={style.serviciosHint}>
                  Ajusta la cantidad de cada servicio. Deja en blanco o escribe 0 para eliminarlo de
                  la reserva.
                </div>

                {serviciosCatalogo.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: '#8a6a4a' }}>
                    No hay servicios configurados en este momento.
                  </div>
                ) : (
                  serviciosCatalogo.map((serv) => (
                    <div key={serv.id} style={style.servicioRow}>
                      <div style={style.servicioNombre}>
                        <div>{serv.nombre}</div>
                      </div>
                      <div style={style.servicioPrecio}>
                        {formatCLP(serv.precio)}
                      </div>
                      <div>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          style={style.servicioInput}
                          value={serviciosEditados[serv.id] ?? ''}
                          onChange={(e) =>
                            manejarCantidadServicio(serv.id, e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={style.infoTotal}>
                <strong>Total pagado actual:</strong>{' '}
                {formatCLP(reservaEditando.total_pagado)}
              </div>

              <div style={style.accionesEdicion}>
                <button style={style.btnGuardar} onClick={manejarGuardarCambios}>
                  <FaSave size={13} /> Guardar cambios
                </button>
                <button
                  style={style.btnCancelar}
                  type="button"
                  onClick={manejarCancelarEdicion}
                >
                  <FaTimes size={13} /> Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
