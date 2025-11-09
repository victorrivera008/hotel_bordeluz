
import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from './ConfirmationModal'; 
import { FaWifi, FaCoffee, FaTemperatureHigh, FaUser, FaExpand, FaTree, FaBed } from 'react-icons/fa';

const style = {
    resultHeader: {
        color: '#4A2A1A',
        marginBottom: '20px',
        fontSize: '1.5rem',
        borderBottom: '1px solid #D4AF37',
        paddingBottom: '10px'
    },
    cardGrid: { 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        marginTop: '40px',
    },
    roomCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #EAEAEA',
        transition: 'transform 0.3s, box-shadow 0.3s',
    },
    cardHover: {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
    },
    cardImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        backgroundColor: '#E0E0E0', 
    },
    cardContent: {
        padding: '20px',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    cardTitle: {
        color: '#4A2A1A',
        fontSize: '1.8rem',
        marginBottom: '10px',
        fontFamily: 'Georgia, serif',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    cardFeatures: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '15px',
        fontSize: '0.9rem',
        color: '#666',
        paddingBottom: '15px',
        borderBottom: '1px solid #EEE',
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    cardFooter: {
        marginTop: 'auto', 
        borderTop: '1px solid #EEE',
        paddingTop: '15px',
        textAlign: 'center',
    },
    priceTag: {
        color: '#D4AF37',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        marginBottom: '10px'
    },
    button: {
        backgroundColor: '#4A2A1A',
        color: 'white',
        padding: '12px 25px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        width: '100%', 
    },
    buttonLogin: {
        backgroundColor: '#f0f0f0', 
        color: '#4A2A1A', 
        border: '1px solid #4A2A1A', 
        padding: '12px 25px',
        borderRadius: '5px', 
        cursor: 'pointer', 
        fontWeight: 'bold', 
        fontSize: '1rem',
        width: '100%',
    }
};


const RoomList = ({ rooms, checkIn, checkOut, triggerLogin }) => {
  const { isAuthenticated, userInfo } = useAuth();
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null); 

  const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  if (rooms.length === 0) {
    return <p style={{textAlign: 'center', fontSize: '1.2rem', padding: '30px'}}>No hay habitaciones disponibles para el rango seleccionado.</p>;
  }

  const formatCLP = (amount) => {
    return new Intl.NumberFormat('es-CL', { 
      style: 'currency', 
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(parseFloat(amount));
  };

  const handleReservationClick = (room) => {
    if (!isAuthenticated) {
      triggerLogin(); 
      return;
    }
    setSelectedRoom(room); 
    setShowConfirmation(true); 
  };
  
  return (
    <div>
      <h3 style={style.resultHeader}>Opciones Disponibles ({diffDays} Noches)</h3>

      <div style={style.cardGrid}> 
        {rooms.map((room) => {

          const tipo = room.tipo_detalle; 
          const precioTotal = parseFloat(tipo.precio_base) * diffDays;
          
          return (
            <div 
                key={room.id} 
                style={{ ...style.roomCard, ...(hoveredCard === room.id ? style.cardHover : {}) }}
                onMouseEnter={() => setHoveredCard(room.id)}
                onMouseLeave={() => setHoveredCard(null)}
            >
              
              <img 
                src={tipo.imagen_url || `https://via.placeholder.com/400x250/69422F/FFFFFF?text=${tipo.nombre.replace(' ','+')}`} 
                alt={tipo.nombre} 
                style={style.cardImage} 
              />
              
              <div style={style.cardContent}>
                <h2 style={style.cardTitle}><FaBed /> {tipo.nombre}</h2>
                <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '10px'}}>Habitación Específica # {room.numero}</p>
                <p style={{fontSize: '0.9rem', color: '#666'}}>{tipo.descripcion || "Descripción no disponible."}</p>
                
                <div style={style.cardFeatures}>
                  <span style={style.featureItem}><FaUser color="#D4AF37" /> {tipo.capacidad_maxima} Personas</span>
                  {tipo.tamano_m2 && <span style={style.featureItem}><FaExpand color="#D4AF37" /> {tipo.tamano_m2}</span>}
                  {tipo.vista && <span style={style.featureItem}><FaTree color="#D4AF37" /> {tipo.vista}</span>}
                </div>

                <div style={style.cardFooter}>
                    <p style={style.priceTag}>Total: {formatCLP(precioTotal)}</p>
                    
                    {!isAuthenticated ? (
                      <button 
                        style={style.buttonLogin} 
                        onClick={triggerLogin} 
                      >
                        Reservar (Inicia Sesión)
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleReservationClick(room)}
                        style={style.button}>
                        Seleccionar y Añadir Servicios
                      </button>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showConfirmation && selectedRoom && (
        <ConfirmationModal 
            room={selectedRoom}
            checkIn={checkIn}
            checkOut={checkOut}
            diffDays={diffDays}
            onClose={() => setShowConfirmation(false)}
            triggerLogin={triggerLogin} 
        />
      )}
    </div>
  );
};

export default RoomList;