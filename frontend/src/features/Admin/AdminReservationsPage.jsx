// frontend/src/features/Admin/AdminReservationsPage.jsx

import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const style = {
  page: {
    minHeight: '70vh',
    background: '#f5f2ec',
    padding: '30px 20px 60px',
    fontFamily: 'Georgia, serif',
  },
  wrapper: {
    maxWidth: '1150px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 22px rgba(0,0,0,0.12)',
    padding: '22px 24px 26px',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '12px',
  },
  title: {
    fontSize: '1.9rem',
    color: '#4A2A1A',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#7a5b3f',
    marginBottom: '12px',
  },
  filtersRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '14px',
    fontSize: '0.85rem',
  },
  select: {
    padding: '6px 8px',
    borderRadius: '8px',
    border: '1px solid #d0b89c',
    fontFamily: 'inherit',
    fontSize: '0.85rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
  },
  th: {
    textAlign: 'left',
    padding: '8px 10px',
    borderBottom: '1px solid #e3d6c2',
    background: '#faf3e4',
    fontWeight: 'bold',
    color: '#5b3a26',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '8px 10px',
    borderBottom: '1px solid #f0e4d3',
    color: '#4a2a1a',
    verticalAlign: 'top',
  },
  badge: (tipo) => ({
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '999px',
    fontSize: '0.75rem',
    background:
      tipo === 'CONFIRMADA'
        ? '#d4edda'
        : tipo === 'CANCELADA'
        ? '#f8d7da'
        : tipo === 'PENDIENTE'
        ? '#fff3cd'
        : '#e2e3e5',
    color:
      tipo === 'CONFIRMADA'
        ? '#155724'
        : tipo === 'CANCELADA'
        ? '#721c24'
        : tipo === 'PENDIENTE'
        ? '#856404'
        : '#383d41',
  }),
  pill: {
    display: 'inline-block',
    background: '#f4e8d8',
    color: '#4a2a1a',
    borderRadius: '999px',
    padding: '2px 8px',
    fontSize: '0.75rem',
  },
  smallText: {
    fontSize: '0.8rem',
    color: '#7b5b40',
  },
  errorBox: {
    marginBottom: '10px',
    padding: '8px 10px',
    borderRadius: '8px',
    background: '#f8d7da',
    color: '#721c24',
    fontSize: '0.85rem',
  },
  infoBox: {
    marginTop: '8px',
    fontSize: '0.8rem',
    color: '#7b5b40',
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

// 👉 helper para mostrar nombre de cliente según lo que venga del backend
const getClienteLabel = (reserva) => {
  const d = reserva.cliente_detalle;

  if (d) {
    const nombre = `${d.first_name || ''} ${d.last_name || ''}`.trim();
    if (nombre) return nombre;
    if (d.username) return d.username;
    if (d.email) return d.email;
  }

  if (reserva.cliente) {
    // si solo viene el id del usuario
    return `Usuario ID ${reserva.cliente}`;
  }

  return 'Reserva como invitado';
};

// 👉 helper para mostrar habitación
const getHabitacionLabel = (reserva) => {
  const h = reserva.habitacion_detalle;

  if (h) {
    return `Hab. ${h.numero} · ${h.tipo_nombre || ''}`.trim();
  }

  if (reserva.habitacion) {
    // si solo viene el id de la habitación
    return `Hab. #${reserva.habitacion}`;
  }

  return 'Sin habitación';
};

const AdminReservationsPage = () => {
  const [reservas, setReservas] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('TODAS');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const resp = await api.get('/reservas/admin/');
        console.log('Reservas admin:', resp.data); // debug

        const data = Array.isArray(resp.data) ? resp.data : [];
        data.sort((a, b) =>
          (b.fecha_checkin || '').localeCompare(a.fecha_checkin || '')
        );

        setReservas(data);
        setFiltered(data);
      } catch (err) {
        console.error('Error cargando reservas admin:', err);
        if (err.response?.status === 403) {
          setErrorMsg(
            'No tienes permisos de administrador para ver todas las reservas.'
          );
        } else {
          setErrorMsg('No se pudieron cargar las reservas.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  useEffect(() => {
    let data = [...reservas];
    if (estadoFiltro !== 'TODAS') {
      data = data.filter((r) => r.estado === estadoFiltro);
    }
    setFiltered(data);
  }, [estadoFiltro, reservas]);

  return (
    <div style={style.page}>
      <div style={style.wrapper}>
        <div style={style.titleRow}>
          <h1 style={style.title}>Gestión de reservas</h1>
          <span style={style.smallText}>
            Vista interna · Solo usuarios Staff
          </span>
        </div>
        <p style={style.subtitle}>
          Revisa, filtra y controla las reservas registradas en el sistema.
        </p>

        {errorMsg && <div style={style.errorBox}>{errorMsg}</div>}

        <div style={style.filtersRow}>
          <div>
            <span style={{ marginRight: 6 }}>Filtrar por estado:</span>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              style={style.select}
            >
              <option value="TODAS">Todas</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="CONFIRMADA">Confirmadas</option>
              <option value="CANCELADA">Canceladas</option>
            </select>
          </div>
          <div style={style.infoBox}>
            Total registros: <strong>{filtered.length}</strong>
          </div>
        </div>

        {loading ? (
          <p>Cargando reservas...</p>
        ) : filtered.length === 0 ? (
          <p>No hay reservas que coincidan con el filtro seleccionado.</p>
        ) : (
          <table style={style.table}>
            <thead>
              <tr>
                <th style={style.th}>Código</th>
                <th style={style.th}>Habitación</th>
                <th style={style.th}>Cliente</th>
                <th style={style.th}>Fechas</th>
                <th style={style.th}>Personas</th>
                <th style={style.th}>Estado</th>
                <th style={style.th}>Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((reserva) => {
                const total =
                  reserva.total_pagado != null
                    ? reserva.total_pagado
                    : reserva.total;

                return (
                  <tr key={reserva.id}>
                    <td style={style.td}>
                      <span style={style.pill}>{reserva.codigo_reserva}</span>
                    </td>
                    <td style={style.td}>{getHabitacionLabel(reserva)}</td>
                    <td style={style.td}>{getClienteLabel(reserva)}</td>
                    <td style={style.td}>
                      <div style={style.smallText}>
                        {reserva.fecha_checkin} → {reserva.fecha_checkout}
                      </div>
                    </td>
                    <td style={style.td}>{reserva.cantidad_personas}</td>
                    <td style={style.td}>
                      <span style={style.badge(reserva.estado)}>
                        {reserva.estado}
                      </span>
                    </td>
                    <td style={style.td}>{formatCLP(total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div style={style.infoBox}>
          * Esta vista es solo de lectura por ahora. Más adelante se pueden
          agregar acciones como cambiar estado, reasignar habitaciones,
          exportar a Excel, etc.
        </div>
      </div>
    </div>
  );
};

export default AdminReservationsPage;
