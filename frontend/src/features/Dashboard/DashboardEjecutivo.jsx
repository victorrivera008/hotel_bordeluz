import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
    FaChartLine, FaBed, FaList, FaConciergeBell, 
    FaPlus, FaMoneyBillWave, FaCheckCircle, FaTags 
} from 'react-icons/fa';

const style = {
    wrapper: {
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#F5F7FA', 
        padding: '30px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxSizing: 'border-box'
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
    },
    mainTitle: { fontSize: '2rem', color: '#2C3E50', margin: 0, fontWeight: '700' },
    subTitle: { color: '#7F8C8D', fontSize: '1rem', marginTop: '5px' },
    
    kpiGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
    },
    kpiCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: '5px solid #D4AF37', 
    },
    kpiLabel: { color: '#7F8C8D', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' },
    kpiValue: { fontSize: '2rem', color: '#2C3E50', fontWeight: 'bold', margin: '10px 0' },
    kpiIcon: { fontSize: '1.5rem', color: '#D4AF37', alignSelf: 'flex-end' },

    tabsContainer: {
        display: 'flex',
        gap: '10px',
        marginBottom: '25px',
        borderBottom: '1px solid #E0E0E0',
        paddingBottom: '10px',
        overflowX: 'auto' 
    },
    tab: (isActive) => ({
        padding: '10px 25px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.95rem',
        transition: 'all 0.3s',
        backgroundColor: isActive ? '#4A2A1A' : 'white',
        color: isActive ? 'white' : '#666',
        border: isActive ? 'none' : '1px solid #E0E0E0',
        boxShadow: isActive ? '0 4px 10px rgba(74, 42, 26, 0.3)' : 'none',
        whiteSpace: 'nowrap'
    }),

    tableContainer: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        overflow: 'hidden', 
        overflowX: 'auto'
    },
    table: { width: '100%', borderCollapse: 'collapse', minWidth: '600px' },
    thead: { backgroundColor: '#F8F9FA' },
    th: { padding: '15px 20px', textAlign: 'left', color: '#555', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase' },
    tr: { borderBottom: '1px solid #EEE' },
    td: { padding: '15px 20px', color: '#333', fontSize: '0.95rem' },
    
    formCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        marginBottom: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        borderTop: '4px solid #D4AF37'
    },
    formRow: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
    input: {
        flex: 1,
        padding: '12px',
        border: '1px solid #E0E0E0',
        borderRadius: '6px',
        fontSize: '1rem',
        minWidth: '150px'
    },
    createBtn: {
        padding: '12px 25px',
        backgroundColor: '#D4AF37',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 6px rgba(212, 175, 55, 0.3)'
    },
    
    badge: (type) => {
        const colors = {
            'CONFIRMADA': { bg: '#E6FFFA', color: '#2C7A7B' },
            'PENDIENTE': { bg: '#FEFCBF', color: '#B7791F' },
            'CANCELADA': { bg: '#FFF5F5', color: '#C53030' },
            'LIBRE': { bg: '#C6F6D5', color: '#276749' },
            'OCUPADA': { bg: '#FED7D7', color: '#9B2C2C' },
            'MANTENIMIENTO': { bg: '#EDF2F7', color: '#4A5568' }
        };
        const style = colors[type] || { bg: '#EDF2F7', color: '#4A5568' };
        return {
            backgroundColor: style.bg,
            color: style.color,
            padding: '5px 12px',
            borderRadius: '15px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            display: 'inline-block'
        };
    },
};

const DashboardEjecutivo = () => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [data, setData] = useState({ reservas: [], habitaciones: [], servicios: [], tipos: [] });
  const [loading, setLoading] = useState(true);
  
  const [newRoom, setNewRoom] = useState({ numero: '', tipo: '', estado: 'LIBRE' });
  const [newService, setNewService] = useState({ nombre: '', precio: '', descripcion: '' });
  const [newType, setNewType] = useState({ nombre: '', capacidad_maxima: '', precio_base: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resReservas, resHab, resServ, resTipos] = await Promise.all([
        api.get('/reservas/'),
        api.get('/habitaciones/'),
        api.get('/servicios/'),
        api.get('/tipos-habitacion/')
      ]);
      setData({
        reservas: resReservas.data,
        habitaciones: resHab.data,
        servicios: resServ.data,
        tipos: resTipos.data
      });
    } catch (error) {
      console.error("Error cargando datos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);


  const handleCreateRoom = async () => {
    if(!newRoom.numero || !newRoom.tipo) return alert("Completa todos los campos");
    try {
      await api.post('/habitaciones/', newRoom);
      alert('Habitación creada exitosamente');
      setNewRoom({ numero: '', tipo: '', estado: 'LIBRE' });
      fetchData();
    } catch (e) { alert('Error: Revisa si el número ya existe.'); }
  };

  const handleCreateService = async () => {
    if(!newService.nombre || !newService.precio) return alert("Completa todos los campos");
    try {
      await api.post('/servicios/', newService);
      alert('Servicio creado exitosamente');
      setNewService({ nombre: '', precio: '', descripcion: '' });
      fetchData();
    } catch (e) { alert('Error al crear servicio'); }
  };

  const handleCreateType = async () => {
    if(!newType.nombre || !newType.precio_base || !newType.capacidad_maxima) return alert("Completa todos los campos");
    try {
      await api.post('/tipos-habitacion/', newType);
      alert('Tipo de habitación creado exitosamente');
      setNewType({ nombre: '', capacidad_maxima: '', precio_base: '' });
      fetchData();
    } catch (e) { alert('Error al crear tipo de habitación'); }
  };

  const formatMoney = (amount) => `$ ${parseInt(amount).toLocaleString('es-CL')}`;

  const totalIncome = data.reservas.reduce((acc, curr) => acc + parseFloat(curr.total_pagado), 0);
  const activeRooms = data.habitaciones.length;
  const freeRooms = data.habitaciones.filter(h => h.estado === 'LIBRE').length;

  if (loading) return <div style={{...style.wrapper, display:'flex', justifyContent:'center', alignItems:'center', fontSize:'1.5rem', color:'#666'}}>Cargando Panel...</div>;

  return (
    <div style={style.wrapper}>
        
        <div style={style.tabsContainer}>
            <div style={style.tab(activeTab === 'resumen')} onClick={() => setActiveTab('resumen')}><FaChartLine/> Resumen</div>
            <div style={style.tab(activeTab === 'reservas')} onClick={() => setActiveTab('reservas')}><FaList/> Reservas</div>
            <div style={style.tab(activeTab === 'habitaciones')} onClick={() => setActiveTab('habitaciones')}><FaBed/> Habitaciones</div>
            <div style={style.tab(activeTab === 'tipos')} onClick={() => setActiveTab('tipos')}><FaTags/> Tipos</div> 
            <div style={style.tab(activeTab === 'servicios')} onClick={() => setActiveTab('servicios')}><FaConciergeBell/> Servicios</div>
        </div>

        {activeTab === 'resumen' && (
            <>
                <div style={style.kpiGrid}>
                    <div style={style.kpiCard}>
                        <span style={style.kpiLabel}>Ingresos Totales</span>
                        <span style={style.kpiValue}>{formatMoney(totalIncome)}</span>
                        <FaMoneyBillWave style={style.kpiIcon}/>
                    </div>
                    <div style={style.kpiCard}>
                        <span style={style.kpiLabel}>Reservas Realizadas</span>
                        <span style={style.kpiValue}>{data.reservas.length}</span>
                        <FaList style={style.kpiIcon}/>
                    </div>
                    <div style={style.kpiCard}>
                        <span style={style.kpiLabel}>Habitaciones Totales</span>
                        <span style={style.kpiValue}>{activeRooms}</span>
                        <FaBed style={style.kpiIcon}/>
                    </div>
                    <div style={style.kpiCard}>
                        <span style={style.kpiLabel}>Disponibilidad Actual</span>
                        <span style={style.kpiValue}>{freeRooms} <span style={{fontSize:'1rem', color:'#888'}}>/ {activeRooms}</span></span>
                        <FaCheckCircle style={{...style.kpiIcon, color: '#276749'}}/>
                    </div>
                </div>

                <div style={{textAlign: 'center', padding: '20px', color: '#888'}}>
                    <p>Selecciona una pestaña superior para gestionar el detalle de cada área.</p>
                </div>
            </>
        )}

        {activeTab === 'reservas' && (
            <div style={style.tableContainer}>
                <table style={style.table}>
                    <thead style={style.thead}>
                        <tr>
                            <th style={style.th}>ID</th>
                            <th style={style.th}>Cliente</th>
                            <th style={style.th}>Habitación</th>
                            <th style={style.th}>Fechas</th>
                            <th style={style.th}>Total</th>
                            <th style={style.th}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.reservas.map(r => (
                            <tr key={r.id} style={style.tr}>
                                <td style={style.td}><strong>{r.codigo_reserva}</strong></td>
                                <td style={style.td}>{r.cliente_nombre || 'Invitado'}</td>
                                <td style={style.td}>#{r.habitacion_numero}</td>
                                <td style={style.td}>{r.fecha_checkin} / {r.fecha_checkout}</td>
                                <td style={style.td}><strong style={{color: '#4A2A1A'}}>{formatMoney(r.total_pagado)}</strong></td>
                                <td style={style.td}><span style={style.badge(r.estado)}>{r.estado}</span></td>
                            </tr>
                        ))}
                        {data.reservas.length === 0 && <tr><td colSpan="6" style={{...style.td, textAlign:'center'}}>No hay reservas registradas.</td></tr>}
                    </tbody>
                </table>
            </div>
        )}

        {activeTab === 'habitaciones' && (
            <>
                <div style={style.formCard}>
                    <h3 style={{margin:'0 0 15px 0', color: '#4A2A1A'}}>Registrar Nueva Habitación</h3>
                    <div style={style.formRow}>
                        <input placeholder="Número (ej. 105)" value={newRoom.numero} onChange={e => setNewRoom({...newRoom, numero: e.target.value})} style={style.input} />
                        <select style={style.input} value={newRoom.tipo} onChange={e => setNewRoom({...newRoom, tipo: e.target.value})}>
                            <option value="">-- Seleccionar Categoría --</option>
                            {data.tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                        </select>
                        <button style={style.createBtn} onClick={handleCreateRoom}><FaPlus/> Crear</button>
                    </div>
                </div>

                <div style={style.tableContainer}>
                    <table style={style.table}>
                        <thead style={style.thead}>
                            <tr>
                                <th style={style.th}>Número</th>
                                <th style={style.th}>Categoría</th>
                                <th style={style.th}>Estado Actual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.habitaciones.map(h => (
                                <tr key={h.id} style={style.tr}>
                                    <td style={style.td}><FaBed style={{marginRight: '8px', color:'#D4AF37'}}/> <strong>{h.numero}</strong></td>
                                    <td style={style.td}>{h.tipo_nombre}</td>
                                    <td style={style.td}><span style={style.badge(h.estado)}>{h.estado}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}

        {activeTab === 'tipos' && (
            <>
                <div style={style.formCard}>
                    <h3 style={{margin:'0 0 15px 0', color: '#4A2A1A'}}>Crear Nueva Categoría</h3>
                    <div style={style.formRow}>
                        <input placeholder="Nombre (ej. Suite Premium)" value={newType.nombre} onChange={e => setNewType({...newType, nombre: e.target.value})} style={{...style.input, flex: 2}} />
                        <input placeholder="Capacidad (Pers)" type="number" value={newType.capacidad_maxima} onChange={e => setNewType({...newType, capacidad_maxima: e.target.value})} style={style.input} />
                        <input placeholder="Precio Base" type="number" value={newType.precio_base} onChange={e => setNewType({...newType, precio_base: e.target.value})} style={style.input} />
                        <button style={style.createBtn} onClick={handleCreateType}><FaPlus/> Crear</button>
                    </div>
                </div>

                <div style={style.tableContainer}>
                    <table style={style.table}>
                        <thead style={style.thead}>
                            <tr>
                                <th style={style.th}>Nombre Categoría</th>
                                <th style={style.th}>Capacidad</th>
                                <th style={style.th}>Precio Base</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.tipos.map(t => (
                                <tr key={t.id} style={style.tr}>
                                    <td style={style.td}><strong>{t.nombre}</strong></td>
                                    <td style={style.td}>{t.capacidad_maxima} Personas</td>
                                    <td style={style.td}><strong style={{color: '#276749'}}>{formatMoney(t.precio_base)}</strong></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}

        {activeTab === 'servicios' && (
            <>
                <div style={style.formCard}>
                    <h3 style={{margin:'0 0 15px 0', color: '#4A2A1A'}}>Crear Nuevo Servicio</h3>
                    <div style={style.formRow}>
                        <input placeholder="Nombre (ej. Masaje)" value={newService.nombre} onChange={e => setNewService({...newService, nombre: e.target.value})} style={{...style.input, flex: 2}} />
                        <input placeholder="Precio" type="number" value={newService.precio} onChange={e => setNewService({...newService, precio: e.target.value})} style={style.input} />
                        <button style={style.createBtn} onClick={handleCreateService}><FaPlus/> Crear</button>
                    </div>
                </div>

                <div style={style.tableContainer}>
                    <table style={style.table}>
                        <thead style={style.thead}>
                            <tr>
                                <th style={style.th}>Nombre del Servicio</th>
                                <th style={style.th}>Precio Unitario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.servicios.map(s => (
                                <tr key={s.id} style={style.tr}>
                                    <td style={style.td}><strong>{s.nombre}</strong></td>
                                    <td style={style.td}><strong style={{color: '#276749'}}>{formatMoney(s.precio)}</strong></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}

    </div>
  );
};

export default DashboardEjecutivo;