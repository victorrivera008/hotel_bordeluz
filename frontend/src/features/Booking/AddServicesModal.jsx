import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const modalStyle = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    content: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '500px', position: 'relative' },
    close: { position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '1.5rem', background: 'none', border: 'none' },
    header: { color: '#4A2A1A', marginBottom: '20px', borderBottom: '2px solid #D4AF37' },
    serviceItem: { display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #EEE' },
    btn: { width: '100%', padding: '12px', backgroundColor: '#D4AF37', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold' }
};

const AddServicesModal = ({ reserva, onClose }) => {
    const [allServices, setAllServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/servicios/').then(res => setAllServices(res.data));
    }, []);

    const handleToggle = (id) => {
        setSelectedServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const handleSubmit = async () => {
        if (selectedServices.length === 0) return onClose(false);
        setLoading(true);
        try {
            const payload = { servicios: selectedServices.map(id => ({ servicio_id: id })) };
            await api.post(`/reservas/${reserva.id}/agregar_servicios/`, payload);
            alert('¡Servicios agregados con éxito! El total ha sido actualizado.');
            onClose(true);
        } catch (error) {
            alert('Error al agregar servicios.');
            setLoading(false);
        }
    };

    return (
        <div style={modalStyle.overlay}>
            <div style={modalStyle.content}>
                <button style={modalStyle.close} onClick={() => onClose(false)}>&times;</button>
                <h2 style={modalStyle.header}>Agregar a Reserva #{reserva.codigo_reserva}</h2>
                <p>Selecciona los servicios adicionales que deseas agregar:</p>
                
                <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                    {allServices.map(s => (
                        <div key={s.id} style={modalStyle.serviceItem}>
                            <label>
                                <input type="checkbox" onChange={() => handleToggle(s.id)} /> {s.nombre}
                            </label>
                            <strong>${parseInt(s.precio).toLocaleString('es-CL')}</strong>
                        </div>
                    ))}
                </div>

                <button style={modalStyle.btn} onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Procesando...' : 'Confirmar y Agregar al Total'}
                </button>
            </div>
        </div>
    );
};

export default AddServicesModal;