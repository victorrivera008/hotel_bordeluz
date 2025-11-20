import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const modalStyle = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 2000,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
    },
    content: {
        backgroundColor: 'white', padding: '30px', borderRadius: '8px',
        maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto',
        position: 'relative', fontFamily: 'Georgia, serif',
    },
    closeButton: {
        position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none',
        fontSize: '1.5rem', cursor: 'pointer', color: '#4A2A1A',
    },
    confirmButton: { 
        padding: '12px 25px', 
        backgroundColor: '#4A2A1A', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px', 
        cursor: 'pointer', 
        fontWeight: 'bold', 
        width: '100%', 
        fontSize: '1.1rem', 
        marginTop: '20px' 
    },
    input: { 
        width: '100%', 
        padding: '10px', 
        border: '1px solid #ccc', 
        borderRadius: '4px', 
        marginTop: '5px',
        fontSize: '1rem'
    }
};

const style = {
    header: { 
        color: '#4A2A1A', 
        borderBottom: '2px solid #D4AF37', 
        paddingBottom: '10px', 
        marginBottom: '20px',
        fontSize: '1.8rem',
        textAlign: 'center'
    },
    sectionTitle: { 
        color: '#4A2A1A', 
        marginTop: '25px', 
        marginBottom: '15px',
        borderBottom: '1px solid #EEE', 
        paddingBottom: '5px',
        fontSize: '1.2rem', 
        fontWeight: 'bold' 
    },
    serviceItem: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px 0', 
        borderBottom: '1px solid #F4E8D8' 
    },
    priceTotal: { 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        color: '#D4AF37', 
        textAlign: 'right', 
        marginTop: '30px',
        borderTop: '2px solid #D4AF37',
        paddingTop: '10px'
    },
    summaryBox: {
        backgroundColor: '#F9F9F9',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #EEE'
    }
};

const formatCLP = (amount) => {
    if (isNaN(parseFloat(amount))) return '$ 0';
    return new Intl.NumberFormat('es-CL', {
        style: 'currency', currency: 'CLP', minimumFractionDigits: 0
    }).format(parseFloat(amount));
};

const ConfirmationModal = ({ room, checkIn, checkOut, diffDays, onClose, triggerLogin }) => {
    const { isAuthenticated } = useAuth();
    const [allServices, setAllServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [guestData, setGuestData] = useState({ first_name: '', last_name: '', email: '', telefono: '' });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reservationStatus, setReservationStatus] = useState(null);

    const roomPrice = parseFloat(room.tipo_detalle.precio_base) * diffDays;

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/servicios/');
                setAllServices(response.data);
            } catch (err) {
                console.error("Error cargando servicios", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleServiceToggle = (service) => {
        setSelectedServices(prev => {
            const isSelected = prev.find(s => s.id === service.id);
            if (isSelected) {
                return prev.filter(s => s.id !== service.id);
            } else {
                return [...prev, service];
            }
        });
    };

    const handleGuestChange = (e) => {
        setGuestData({
            ...guestData,
            [e.target.name]: e.target.value,
        });
    };

    const servicesPrice = selectedServices.reduce((total, s) => total + parseFloat(s.precio), 0);
    const totalPrice = roomPrice + servicesPrice;

    const handleFinalReservation = async () => {
        if (!isAuthenticated) {
            if (!guestData.first_name || !guestData.last_name || !guestData.email) {
                setError('Por favor, completa tus datos de contacto (Nombre, Apellido, Email).');
                return;
            }
        }

        setLoading(true);
        setError('');

        const servicesPayload = selectedServices.map(s => ({
            servicio_id: s.id,
            cantidad: 1
        }));

        const payload = {
            habitacion: room.id,
            fecha_checkin: checkIn,
            fecha_checkout: checkOut,
            servicios: servicesPayload,
            guest_data: !isAuthenticated ? guestData : null 
        };

        try {
            const response = await api.post('/reservas/', payload);

            setReservationStatus({
                success: `¡Reserva #${response.data.reserva.codigo_reserva} CONFIRMADA! Total: ${formatCLP(response.data.reserva.total_pagado)}. Revisa tu email.`
            });
        } catch (err) {
            const msg = err.response?.data?.cliente?.[0] || err.message || "Error al procesar la reserva.";
            setError(`Fallo: ${msg}`);
            console.error("Error al crear reserva:", err.response || err);
        } finally {
            setLoading(false);
        }
    };

    if (reservationStatus?.success) {
        return (
            <div style={modalStyle.overlay}>
                <div style={modalStyle.content}>
                    <h2 style={{color: 'darkgreen', textAlign: 'center'}}>✅ ¡Reserva Exitosa!</h2>
                    <p style={{textAlign: 'center', margin: '20px 0', fontSize: '1.2rem'}}>{reservationStatus.success}</p>
                    <button onClick={onClose} style={{ ...modalStyle.confirmButton, backgroundColor: '#D4AF37' }}>Cerrar</button>
                </div>
            </div>
        );
    }

    return (
        <div style={modalStyle.overlay}>
            <div style={modalStyle.content}>
                <button onClick={onClose} style={modalStyle.closeButton}>&times;</button>
                
                <h2 style={style.header}>Confirmar Reserva</h2>

                <div style={style.summaryBox}>
                    <h4 style={{margin: '0 0 10px 0', color: '#4A2A1A'}}>Resumen de Estadía</h4>
                    <p style={{margin: '5px 0'}}><strong>Habitación:</strong> {room.tipo_detalle.nombre}</p>
                    <p style={{margin: '5px 0'}}><strong>Fechas:</strong> {checkIn} al {checkOut} ({diffDays} noches)</p>
                    <p style={{margin: '5px 0'}}><strong>Precio Base:</strong> {formatCLP(roomPrice)}</p>
                </div>

                {!isAuthenticated && (
                    <>
                        <h3 style={style.sectionTitle}>Tus Datos (Invitado)</h3>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '10px'}}>
                            <input style={modalStyle.input} name="first_name" placeholder="Nombre" onChange={handleGuestChange} />
                            <input style={modalStyle.input} name="last_name" placeholder="Apellido" onChange={handleGuestChange} />
                        </div>
                        <input style={modalStyle.input} name="email" placeholder="Correo Electrónico" type="email" onChange={handleGuestChange} />
                        <input style={{...modalStyle.input, marginTop: '10px'}} name="telefono" placeholder="Teléfono" onChange={handleGuestChange} />
                        <p style={{fontSize: '0.8rem', color: '#666', marginTop: '5px'}}>* Crearemos una cuenta automáticamente para ti.</p>
                    </>
                )}

                <h3 style={style.sectionTitle}>Añadir Servicios Adicionales</h3>
                {loading && <p>Cargando servicios...</p>}
                
                <div style={{maxHeight: '150px', overflowY: 'auto', border: '1px solid #EEE', padding: '10px', borderRadius: '4px'}}>
                    {allServices.map(service => (
                        <div key={service.id} style={style.serviceItem}>
                            <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                                <input 
                                    type="checkbox" 
                                    onChange={() => handleServiceToggle(service)}
                                />
                                {service.nombre}
                            </label>
                            <span style={{fontWeight: 'bold'}}>{formatCLP(service.precio)}</span>
                        </div>
                    ))}
                    {allServices.length === 0 && !loading && <p>No hay servicios adicionales disponibles.</p>}
                </div>

                <div style={style.priceTotal}>
                    Total a Pagar: {formatCLP(totalPrice)}
                </div>

                {error && <p style={{color: 'red', textAlign: 'center', marginTop: '15px', fontWeight: 'bold'}}>{error}</p>}

                <button 
                    onClick={handleFinalReservation} 
                    disabled={loading}
                    style={modalStyle.confirmButton}
                >
                    {loading ? 'Procesando...' : 'Confirmar y Pagar'}
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;