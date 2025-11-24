// src/features/Booking/BookingPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  FaCalendarAlt,
  FaBed,
  FaConciergeBell,
  FaUserCheck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaUser,
} from 'react-icons/fa';

const style = {
  page: {
    minHeight: '80vh',
    background: 'linear-gradient(135deg, #f4e8d8 0%, #f9f3ea 100%)',
    padding: '40px 20px 80px',
    fontFamily: 'Georgia, serif',
  },
  wrapper: {
    maxWidth: '1150px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '22px',
  },
  title: {
    fontSize: '2.2rem',
    color: '#4A2A1A',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6A4832',
  },
  stepsBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '18px',
    marginBottom: '20px',
  },
  stepItem: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '999px',
    border: active ? '1px solid #D4AF37' : '1px solid #e3d3b8',
    backgroundColor: active ? '#fff7df' : '#fbf5ea',
    color: active ? '#4A2A1A' : '#8a6a4a',
    fontSize: '0.9rem',
  }),
  stepCircle: (active) => ({
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: active ? '2px solid #D4AF37' : '2px solid #d9c7a6',
    backgroundColor: active ? '#D4AF37' : 'transparent',
  }),

  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 10px 26px rgba(0,0,0,0.12)',
    padding: '26px 26px 24px',
    display: 'grid',
    gridTemplateColumns: '2.1fr 1.2fr',
    gap: '26px',
  },
  containerStack: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 10px 26px rgba(0,0,0,0.12)',
    padding: '22px 18px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  sectionTitle: {
    fontSize: '1.15rem',
    color: '#4A2A1A',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sectionHint: {
    fontSize: '0.85rem',
    color: '#7b5a3b',
    marginBottom: '10px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    color: '#4A2A1A',
    marginBottom: '4px',
  },
  smallLabel: {
    fontSize: '0.8rem',
    color: '#8a6a4a',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '9px 11px',
    borderRadius: '8px',
    border: '1px solid #D0B89C',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputError: {
    border: '1px solid #c0392b',
    backgroundColor: '#fff5f4',
  },

  roomList: {
    marginTop: '10px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
  },
  roomCard: (selected) => ({
    borderRadius: '12px',
    border: selected ? '2px solid #D4AF37' : '1px solid #F0E0C8',
    backgroundColor: selected ? '#fffaf0' : '#FFFBF4',
    padding: '10px 10px 12px',
    boxShadow: selected ? '0 6px 16px rgba(0,0,0,0.12)' : '0 2px 6px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  }),
  roomHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    alignItems: 'center',
  },
  roomTitle: {
    fontSize: '1rem',
    color: '#4A2A1A',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  roomType: {
    fontSize: '0.8rem',
    color: '#8a6a4a',
  },
  roomMeta: {
    fontSize: '0.85rem',
    color: '#6A4832',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  roomPriceNote: {
    fontSize: '0.75rem',
    color: '#8A6A4A',
    marginTop: '2px',
  },

  serviciosList: {
    borderRadius: '10px',
    border: '1px solid #F0E0C8',
    padding: '10px 10px 4px',
    maxHeight: '220px',
    overflowY: 'auto',
    backgroundColor: '#FFFBF4',
  },
  servicioRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: '#4A2A1A',
    marginBottom: '8px',
    gap: '8px',
  },
  servicioNombre: {
    flex: 1,
  },
  servicioControles: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  servicioQtyInput: {
    width: '60px',
    padding: '4px 6px',
    borderRadius: '6px',
    border: '1px solid #D0B89C',
    fontSize: '0.85rem',
  },

  buttonPrimary: {  
    marginTop: '18px',
    background: 'linear-gradient(90deg, #D4AF37, #c49b2e)',
    border: 'none',
    color: 'white',
    padding: '11px 22px',
    borderRadius: '999px',
    fontSize: '0.98rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 6px 14px rgba(0,0,0,0.18)',
  },
  buttonSecondary: {
    marginTop: '14px',
    background: 'transparent',
    border: '1px solid #D4AF37',
    color: '#4A2A1A',
    padding: '8px 16px',
    borderRadius: '999px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },

  badgeWarning: {
    padding: '8px 12px',
    borderRadius: '10px',
    backgroundColor: '#FFF3CD',
    border: '1px solid #FFEEBA',
    color: '#856404',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  badgeSuccess: {
    padding: '8px 12px',
    borderRadius: '10px',
    backgroundColor: '#D4EDDA',
    border: '1px solid #C3E6CB',
    color: '#155724',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  errorText: {
    marginTop: '4px',
    color: '#c0392b',
    fontSize: '0.8rem',
  },

  sidePanel: {
    backgroundColor: '#FFF7E3',
    borderRadius: '12px',
    padding: '16px 14px 14px',
    border: '1px solid #F0E0C8',
    fontSize: '0.9rem',
    color: '#4A2A1A',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sideTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '6px',
  },
  sideBlock: {
    padding: '8px 0',
    borderBottom: '1px dashed #e0cda9',
  },
  sideBlockLast: {
    paddingTop: '8px',
  },
  highlightText: {
    fontWeight: 'bold',
  },
  totalLine: {
    marginTop: '6px',
    paddingTop: '6px',
    borderTop: '1px dashed #D0B89C',
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
  },

  miniRoomCard: {
    marginTop: '6px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  miniRoomImage: {
    width: '70px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover',
    backgroundColor: '#ddd',
  },
  miniRoomInfo: {
    fontSize: '0.85rem',
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

const describeServicio = (serv) => {
  if (serv.descripcion && serv.descripcion.trim() !== '') {
    return serv.descripcion;
  }
  const tipo = (serv.tipo || '').toUpperCase();
  if (tipo === 'SAUNA') return 'Valor por cada 30 minutos de uso de sauna.';
  if (tipo === 'MASAJE') return 'Sesión individual de masaje de 50 minutos.';
  if (tipo === 'TINAJA') return 'Valor por cada sesión de tinaja privada.';
  return 'Servicio adicional opcional.';
};

const calcularSubtotalServicio = (serv, qty) => {
  return (serv.precio || 0) * qty;
};

const BookingPage = () => {
  const { isAuthenticated } = useAuth();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const [servicios, setServicios] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState({});

  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const [loadingInit, setLoadingInit] = useState(true);
  const [searchingRooms, setSearchingRooms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [detalleReserva, setDetalleReserva] = useState(null);

  const isNarrow = typeof window !== 'undefined' && window.innerWidth < 900;
  const containerStyle = isNarrow ? style.containerStack : style.container;

  // Fechas por defecto: hoy y mañana
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const yyyy2 = tomorrow.getFullYear();
    const mm2 = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd2 = String(tomorrow.getDate()).padStart(2, '0');
    const tomorrowStr = `${yyyy2}-${mm2}-${dd2}`;

    setCheckIn(todayStr);
    setCheckOut(tomorrowStr);
  }, []);

  // Cargar servicios
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        setLoadingInit(true);
        const resp = await api.get('/servicios/');
        setServicios(Array.isArray(resp.data) ? resp.data : []);
      } catch (err) {
        console.error('Error cargando servicios:', err);
        setErrorMsg('No se pudieron cargar los servicios adicionales.');
      } finally {
        setLoadingInit(false);
      }
    };
    fetchServicios();
  }, []);

  const validateSearch = () => {
    const errors = {};
    if (!checkIn) errors.checkIn = 'Selecciona una fecha de llegada.';
    if (!checkOut) errors.checkOut = 'Selecciona una fecha de salida.';
    if (checkIn && checkOut && new Date(checkIn) >= new Date(checkOut)) {
      errors.checkOut = 'La fecha de salida debe ser posterior a la de llegada.';
    }
    if (!guests || guests <= 0) {
      errors.guests = 'Indica la cantidad de personas.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBuscarHabitaciones = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setDetalleReserva(null);
    setAvailableRooms([]);
    setSelectedRoomId(null);

    const ok = validateSearch();
    if (!ok) {
      setErrorMsg('Revisa las fechas y la cantidad de personas antes de continuar.');
      return;
    }

    try {
      setSearchingRooms(true);
      const resp = await api.get('/reservas/disponibilidad/', {
        params: {
          check_in: checkIn,
          check_out: checkOut,
        },
      });

      let rooms = Array.isArray(resp.data) ? resp.data : [];
      // Ya vienen ordenadas por número desde el backend

      rooms = rooms.filter((r) => {
        const cap = r.tipo_detalle?.capacidad_maxima;
        if (!cap) return false;
        return cap >= guests;
      });

      setAvailableRooms(rooms);

      if (rooms.length === 0) {
        setErrorMsg(
          'No se encontraron habitaciones disponibles para esas fechas con esa cantidad de personas.'
        );
      }
    } catch (err) {
      console.error('Error buscando habitaciones disponibles:', err);
      setErrorMsg('No se pudo consultar la disponibilidad. Intenta nuevamente.');
    } finally {
      setSearchingRooms(false);
    }
  };

  const handleCantidadServicio = (servicioId, cantidad) => {
    const value = parseInt(cantidad, 10);
    if (isNaN(value) || value <= 0) {
      setServiciosSeleccionados((prev) => {
        const copy = { ...prev };
        delete copy[servicioId];
        return copy;
      });
    } else {
      setServiciosSeleccionados((prev) => ({
        ...prev,
        [servicioId]: value,
      }));
    }
  };

  const selectedRoom = useMemo(
    () => availableRooms.find((r) => String(r.id) === String(selectedRoomId)) || null,
    [availableRooms, selectedRoomId]
  );

  const getPrecioAjustadoPorNoche = (room) => {
    if (!room || !room.tipo_detalle) return 0;
    const basePrecio = room.tipo_detalle.precio_base || 0;
    const capacidad = room.tipo_detalle.capacidad_maxima || 0;
    if (!capacidad || !guests) return basePrecio;

    const diferencia = Math.max(capacidad - guests, 0);
    const descuento = diferencia * 15000;
    const ajustado = Math.max(basePrecio - descuento, 0);
    return ajustado;
  };

  const totalEstimado = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    const d1 = new Date(checkIn).getTime();
    const d2 = new Date(checkOut).getTime();
    const dias = (d2 - d1) / (1000 * 60 * 60 * 24);
    if (dias <= 0) return null;

    let total = 0;

    if (selectedRoom) {
      const precioNoche = getPrecioAjustadoPorNoche(selectedRoom);
      total += dias * precioNoche;
    }

    for (const serv of servicios) {
      const qty = serviciosSeleccionados[serv.id];
      if (qty && serv.precio) {
        total += calcularSubtotalServicio(serv, qty);
      }
    }

    return total;
  }, [selectedRoom, checkIn, checkOut, servicios, serviciosSeleccionados, guests]);

  const validateBeforeSubmit = () => {
    const errors = {};
    if (!checkIn) errors.checkIn = 'Selecciona una fecha de llegada.';
    if (!checkOut) errors.checkOut = 'Selecciona una fecha de salida.';
    if (checkIn && checkOut && new Date(checkIn) >= new Date(checkOut)) {
      errors.checkOut = 'La fecha de salida debe ser posterior a la de llegada.';
    }
    if (!guests || guests <= 0) {
      errors.guests = 'Indica la cantidad de personas.';
    }

    const hasServices = Object.keys(serviciosSeleccionados).length > 0;
    if (!selectedRoom && !hasServices) {
      errors.room = 'Selecciona una habitación o al menos un servicio.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setDetalleReserva(null);

    const ok = validateBeforeSubmit();
    if (!ok) {
      setErrorMsg('Revisa los campos marcados antes de confirmar tu reserva.');
      return;
    }

    const serviciosPayload = Object.entries(serviciosSeleccionados).map(
      ([servicio_id, cantidad]) => ({
        servicio_id: Number(servicio_id),
        cantidad,
      })
    );

    const payload = {
      habitacion: selectedRoom ? selectedRoom.id : null,
      fecha_checkin: checkIn,
      fecha_checkout: checkOut,
      cantidad_personas: guests,
      servicios: serviciosPayload,
    };

    try {
      setSubmitting(true);
      const res = await api.post('/reservas/', payload);
      setSuccessMsg('Reserva creada correctamente. El pago ha sido simulado como APROBADO.');
      setDetalleReserva(res.data);
    } catch (err) {
      console.error('Error al crear reserva:', err);
      if (err.response?.data) {
        const data = err.response.data;
        const msg =
          typeof data === 'string'
            ? data
            : data.detail ||
              data.error ||
              data.message ||
              JSON.stringify(data, null, 2);
        setErrorMsg(msg);
      } else {
        setErrorMsg('Ocurrió un error al procesar la reserva. Intenta nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const step1Done = !!checkIn && !!checkOut && guests > 0;
  const step2Done = step1Done;
  const step3Done = !!detalleReserva;

  return (
    <div style={style.page}>
      <div style={style.wrapper}>
        <div style={style.header}>
          <h1 style={style.title}>Reserva online</h1>
          <p style={style.subtitle}>
            Puedes reservar tu estadía con habitación o también solo servicios del spa (sauna,
            masajes, tinaja) sin necesidad de hospedarte.
          </p>

          <div style={style.stepsBar}>
            <div style={style.stepItem(step1Done)}>
              <span style={style.stepCircle(step1Done)} />
              Fechas y personas
            </div>
            <div style={style.stepItem(step2Done)}>
              <span style={style.stepCircle(step2Done)} />
              Habitaciones (opcional)
            </div>
            <div style={style.stepItem(step3Done)}>
              <span style={style.stepCircle(step3Done)} />
              Servicios y confirmación
            </div>
          </div>
        </div>

        <div style={containerStyle}>
          <div>
            {errorMsg && (
              <div style={style.badgeWarning}>
                <FaExclamationTriangle />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div style={style.badgeSuccess}>
                <FaCheckCircle />
                <span>{successMsg}</span>
              </div>
            )}

            {!isAuthenticated && (
              <div style={style.badgeWarning}>
                <FaUserCheck />
                <span>
                  Puedes reservar como invitado. Si inicias sesión, tus reservas quedarán asociadas
                  a tu cuenta.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={style.formGroup}>
                <div style={style.sectionTitle}>
                  <FaCalendarAlt /> Fechas y cantidad de personas
                </div>
                <p style={style.sectionHint}>
                  Indica tu fecha de llegada, salida y el número de personas. Si reservas solo
                  servicios, estas fechas marcarán el rango de tu experiencia.
                </p>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '140px' }}>
                    <label style={style.label}>Llegada (check-in)</label>
                    <input
                      type="date"
                      style={{
                        ...style.input,
                        ...(fieldErrors.checkIn ? style.inputError : {}),
                      }}
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                    {fieldErrors.checkIn && (
                      <div style={style.errorText}>{fieldErrors.checkIn}</div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: '140px' }}>
                    <label style={style.label}>Salida (check-out)</label>
                    <input
                      type="date"
                      style={{
                        ...style.input,
                        ...(fieldErrors.checkOut ? style.inputError : {}),
                      }}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                    {fieldErrors.checkOut && (
                      <div style={style.errorText}>{fieldErrors.checkOut}</div>
                    )}
                  </div>
                  <div style={{ flex: 0.7, minWidth: '120px' }}>
                    <label style={style.label}>Personas</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      style={{
                        ...style.input,
                        ...(fieldErrors.guests ? style.inputError : {}),
                      }}
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value || '0', 10))}
                    />
                    {fieldErrors.guests && (
                      <div style={style.errorText}>{fieldErrors.guests}</div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  style={{
                    ...style.buttonSecondary,
                    ...(searchingRooms ? style.buttonDisabled : {}),
                  }}
                  onClick={handleBuscarHabitaciones}
                  disabled={searchingRooms}
                >
                  {searchingRooms ? 'Buscando habitaciones...' : 'Buscar habitaciones disponibles'}
                </button>
              </div>

              <div style={style.formGroup}>
                <div style={style.sectionTitle}>
                  <FaBed /> Habitaciones disponibles (opcional)
                </div>
                <p style={style.sectionHint}>
                  Puedes elegir una habitación para tu estadía o dejar esta sección en blanco si
                  solo deseas reservar servicios del spa.
                </p>

                {availableRooms.length === 0 && !searchingRooms && (
                  <p style={{ fontSize: '0.85rem', color: '#6A4832' }}>
                    Aún no se han cargado habitaciones disponibles. Realiza una búsqueda con tus
                    fechas y número de personas si deseas hospedarte.
                  </p>
                )}

                {availableRooms.length > 0 && (
                  <div style={style.roomList}>
                    {availableRooms.map((room) => {
                      const selected = String(room.id) === String(selectedRoomId);
                      const capacidad = room.tipo_detalle?.capacidad_maxima || 0;
                      const basePrecio = room.tipo_detalle?.precio_base || 0;
                      const diferencia = Math.max(capacidad - (guests || 0), 0);
                      const descuento = diferencia * 15000;
                      const precioAjustado = Math.max(basePrecio - descuento, 0);

                      return (
                        <div
                          key={room.id}
                          style={style.roomCard(selected)}
                          onClick={() => setSelectedRoomId(room.id)}
                        >
                          <div style={style.roomHeader}>
                            <div style={style.roomTitle}>
                              <FaBed /> Habitación {room.numero}
                            </div>
                            <div style={style.roomType}>
                              {room.tipo_detalle?.nombre || 'Tipo de habitación'}
                            </div>
                          </div>
                          <div style={style.roomMeta}>
                            <span>
                              <FaUser style={{ marginRight: '4px' }} />
                              {capacidad
                                ? `${capacidad} huéspedes`
                                : 'Capacidad no especificada'}
                            </span>
                            <span>{formatCLP(precioAjustado)} / noche</span>
                          </div>
                          {diferencia > 0 && (
                            <div style={style.roomPriceNote}>
                              Tarifa ajustada por capacidad sobrante de {diferencia} persona(s).
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {fieldErrors.room && (
                  <div style={{ ...style.errorText, marginTop: '6px' }}>
                    {fieldErrors.room}
                  </div>
                )}
              </div>

              <div style={style.formGroup}>
                <div style={style.sectionTitle}>
                  <FaConciergeBell /> Servicios adicionales (spa)
                </div>
                <p style={style.sectionHint}>
                  Puedes reservar servicios aun sin habitación: sauna, masajes, tinaja u otros
                  servicios disponibles.
                </p>
                <p style={style.smallLabel}>
                  <FaInfoCircle style={{ marginRight: '4px' }} />
                  Indica la cantidad deseada. Deja en blanco o 0 si no deseas un servicio.
                </p>
                <div style={style.serviciosList}>
                  {servicios.length === 0 ? (
                    <span style={{ fontSize: '0.85rem', color: '#6A4832' }}>
                      No hay servicios configurados en este momento.
                    </span>
                  ) : (
                    servicios.map((serv) => (
                      <div key={serv.id} style={style.servicioRow}>
                        <div style={style.servicioNombre}>
                          <div>{serv.nombre}</div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: '#8a6a4a',
                              marginTop: '2px',
                            }}
                          >
                            {describeServicio(serv)}
                          </div>
                        </div>
                        <div style={style.servicioControles}>
                          <span style={{ fontSize: '0.85rem', color: '#6A4832' }}>
                            {formatCLP(serv.precio)}
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            style={style.servicioQtyInput}
                            value={serviciosSeleccionados[serv.id] || ''}
                            onChange={(e) =>
                              handleCantidadServicio(serv.id, e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                type="submit"
                style={{
                  ...style.buttonPrimary,
                  ...(submitting ? style.buttonDisabled : {}),
                }}
                disabled={submitting}
              >
                {submitting ? 'Procesando reserva...' : 'Confirmar reserva'}
              </button>
            </form>
          </div>

          <div style={style.sidePanel}>
            <div style={style.sideTitle}>Resumen de tu reserva</div>

            <div style={style.sideBlock}>
              <span style={style.highlightText}>Fechas:</span>
              <br />
              {checkIn || checkOut
                ? `${checkIn || '—'} → ${checkOut || '—'}`
                : 'Selecciona fechas de llegada y salida.'}
              <br />
              <span>
                <span style={style.highlightText}>Personas:</span> {guests || '—'}
              </span>
            </div>

            <div style={style.sideBlock}>
              <span style={style.highlightText}>Habitación seleccionada (opcional):</span>
              <br />
              {selectedRoom ? (
                <div style={style.miniRoomCard}>
                  <img
                    style={style.miniRoomImage}
                    src={`/imagenes/h${selectedRoom.numero}.jpg`}
                    alt={`Habitación ${selectedRoom.numero}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div style={style.miniRoomInfo}>
                    <div>
                      Habitación {selectedRoom.numero}{' '}
                      {selectedRoom.tipo_detalle?.nombre
                        ? `· ${selectedRoom.tipo_detalle.nombre}`
                        : ''}
                    </div>
                    <div>
                      {selectedRoom.tipo_detalle?.capacidad_maxima || '-'} huéspedes ·{' '}
                      {formatCLP(getPrecioAjustadoPorNoche(selectedRoom))} / noche (ajustado)
                    </div>
                  </div>
                </div>
              ) : (
                <span>Reserva solo servicios del spa (sin habitación).</span>
              )}
            </div>

            <div style={style.sideBlock}>
              <span style={style.highlightText}>Servicios seleccionados:</span>
              <ul style={{ marginTop: '4px', marginBottom: 0, paddingLeft: '18px' }}>
                {Object.keys(serviciosSeleccionados).length === 0 && (
                  <li style={{ fontSize: '0.85rem', color: '#6A4832' }}>
                    Sin servicios adicionales.
                  </li>
                )}
                {Object.entries(serviciosSeleccionados).map(([id, qty]) => {
                  const serv = servicios.find((s) => String(s.id) === String(id));
                  if (!serv) return null;
                  const subtotalServ = calcularSubtotalServicio(serv, qty);
                  return (
                    <li key={id}>
                      {qty} × {serv.nombre} ({formatCLP(subtotalServ)})
                    </li>
                  );
                })}
              </ul>
            </div>

            <div style={style.sideBlockLast}>
              <div style={style.totalLine}>
                <span>Total estimado:</span>
                <span>{totalEstimado ? formatCLP(totalEstimado) : '—'}</span>
              </div>

              {detalleReserva && (
                <div style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={style.highlightText}>Código de reserva: </span>
                    {detalleReserva?.reserva?.codigo_reserva ||
                      detalleReserva?.codigo_reserva ||
                      '—'}
                  </div>
                  <div>
                    <span style={style.highlightText}>Estado: </span>
                    {detalleReserva?.reserva?.estado ||
                      detalleReserva?.estado ||
                      'CONFIRMADA (simulada)'}
                  </div>
                  {detalleReserva?.transaccion_id && (
                    <div>
                      <span style={style.highlightText}>ID transacción: </span>
                      {detalleReserva.transaccion_id}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
