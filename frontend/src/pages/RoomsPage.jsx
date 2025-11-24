// src/pages/RoomsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaUser, FaWifi, FaCoffee, FaBed, FaTree, FaArrowRight } from 'react-icons/fa';

const style = {
  page: {
    minHeight: '80vh',
    backgroundColor: '#F4E8D8',
    padding: '40px 20px 80px',
    fontFamily: 'Georgia, serif',
  },
  headerWrapper: {
    maxWidth: '1200px',
    margin: '0 auto 30px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.8rem',
    color: '#4A2A1A',
    borderBottom: '3px solid #D4AF37',
    display: 'inline-block',
    paddingBottom: '10px',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#5A3B28',
    maxWidth: '800px',
    margin: '0 auto',
  },
  grid: {
    maxWidth: '1200px',
    margin: '30px auto 0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 10px 18px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 14px 24px rgba(0,0,0,0.12)',
  },
  content: {
    padding: '18px 20px 20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  roomTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '6px',
  },
  roomName: {
    fontSize: '1.4rem',
    color: '#4A2A1A',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  roomType: {
    fontSize: '0.9rem',
    color: '#8A6A4A',
    fontStyle: 'italic',
  },
  featuresTopRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px',
    marginTop: '8px',
    paddingBottom: '10px',
    borderBottom: '1px solid #F0E0C8',
    fontSize: '0.9rem',
    color: '#5A3B28',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  descList: {
    listStyle: 'none',
    padding: 0,
    margin: '10px 0 0',
    fontSize: '0.92rem',
    color: '#4A2A1A',
  },
  descItem: {
    marginBottom: '4px',
  },
  bottomRow: {
    marginTop: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  },
  priceText: {
    fontWeight: 'bold',
    color: '#4A2A1A',
    fontSize: '1.05rem',
  },
  reservarBtn: {
    backgroundColor: '#D4AF37',
    border: 'none',
    color: '#FFFFFF',
    padding: '10px 16px',
    borderRadius: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  chipZona: {
    marginTop: '6px',
    fontSize: '0.8rem',
    color: '#6F4F37',
    backgroundColor: '#F4E0C2',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '999px',
  },
  debugBox: {
    maxWidth: '1200px',
    margin: '20px auto',
    background: '#fff3cd',
    border: '1px solid #ffeeba',
    borderRadius: '8px',
    padding: '10px 15px',
    fontSize: '0.9rem',
    color: '#856404',
  },
};

// ========================================================
//  IMÁGENES POR HABITACIÓN
//  Para la 101 usamos 5 fotos: h101, h101-2, h101-3, h101-4, h101-5
//  El resto: una sola foto h{numero}.jpg
// ========================================================
const getRoomImages = (numero) => {
  if (!numero) return [];
  const nStr = String(numero);
  const basePath = '/imagenes/';

  if (nStr === '101') {
    return [
      `${basePath}h101.jpg`,
      `${basePath}h101-2.jpg`,
      `${basePath}h101-3.jpg`,
      `${basePath}h101-4.jpg`,
      `${basePath}h101-5.jpg`,
    ];
  }

  // Por defecto, una sola imagen por habitación
  return [`${basePath}h${nStr}.jpg`];
};

// ========================================================
//  DESCRIPCIONES Y ZONAS
// ========================================================
const getCustomDescription = (numero) => {
  const map = {
    '101': [
      '26 m² habitación + terraza',
      'Cama King',
      'Terraza privada con juego exterior',
      'Vista panorámica al lago',
    ],
    '102': [
      '26 m² habitación + terraza',
      'Cama King',
      'Terraza privada con juego exterior',
      'Vista panorámica al lago',
    ],
    '103': [
      '40 m² habitación + terraza',
      'Cama King',
      'Terraza privada con juego exterior',
      'Vista panorámica al lago',
    ],
    '104': [
      '39 m² habitación + terraza',
      'Cama King',
      'Terraza privada con juego exterior',
      'Vista panorámica al lago',
    ],
    '105': [
      '39 m² habitación + terraza',
      'Cama 2 plazas + 2 camas 1 plaza',
      'Terraza privada con juego exterior',
      'Vista panorámica al lago',
    ],
    '106': [
      'Habitación cuádruple (2 plazas + 2 x 1 plaza)',
      '39 m² habitación + terraza',
      'Terraza privada con juego exterior',
      'Vista panorámica al lago',
    ],
    '107': [
      '31 m² habitación',
      'Cama King + 2 camas 1 plaza',
      'TV 40″',
      'Vista parcial al lago',
    ],
    '108': [
      '32 m² habitación + terraza',
      'Cama King',
      'Jacuzzi en la habitación',
      'Vista parcial al lago',
    ],
    '109': [
      '18 m² habitación',
      'Cama 2 plazas',
      'Vista jardines interiores',
    ],
    '110': [
      '18 m² habitación',
      'Cama Full',
      'Vista jardines interiores',
    ],
    '111': [
      '20 m² habitación',
      'Cama King',
      'Vista parcial al lago',
    ],
    '112': [
      '20 m² habitación',
      'Cama King',
      'Vista parcial al lago',
    ],
    '113': [
      '24 m² habitación',
      'Cama King + diván',
      'Vista jardines interiores',
    ],
    '114': [
      '32 m² habitación',
      'Cama 2 plazas + 2 camas 1 plaza',
      'Vista jardines interiores',
    ],
    '115': [
      '18 m² habitación',
      'Cama King',
      'Vista interior',
      'Servicio de mucama',
    ],
    '116': [
      '15 m² habitación',
      'Cama King',
      'Vista piscina',
    ],
    '117': [
      '15 m² habitación',
      'Cama King',
      'Vista piscina',
    ],
  };

  return map[String(numero)] || [];
};

const zonaLabel = (numero) => {
  const n = parseInt(numero, 10);
  if ([101, 102, 103, 104, 105, 106].includes(n)) return 'Sector terraza con vista lago';
  if ([107, 108, 111, 112].includes(n)) return 'Vista parcial al lago';
  if ([109, 110, 113, 114].includes(n)) return 'Sector jardines interiores';
  if ([115, 116, 117].includes(n)) return 'Sector interior / piscina';
  return 'Zona Bordeluz';
};

// ========================================================
//  COMPONENTE CARD (con carrusel + expandir imagen)
// ========================================================
const RoomCard = ({ hab, onReservar }) => {
  const [hover, setHover] = useState(false);
  const images = getRoomImages(hab.numero);
  const [current, setCurrent] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false); // 👈 NUEVO

  // Auto-slide cada 3 segundos si hay más de 1 imagen
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [images.length]);

  const goPrev = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const goNext = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const formatCLP = (amount) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const desc = getCustomDescription(hab.numero);

  return (
    <>
      <div
        style={{ ...style.card, ...(hover ? style.cardHover : {}) }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* CARRUSEL */}
        <div
          style={{ position: 'relative', width: '100%', height: '190px', overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => setIsExpanded(true)} // 👈 abre imagen expandida
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Habitación ${hab.numero}`}
              style={{
                width: '100%',
                height: '190px',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: index === current ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
              }}
              onError={(e) => {
                // Si una imagen no existe, la escondemos
                e.target.style.display = 'none';
              }}
            />
          ))}

          {images.length > 1 && (
            <>
              {/* Flechas */}
              <button
                onClick={goPrev}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '10px',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.4)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                }}
              >
                ‹
              </button>
              <button
                onClick={goNext}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.4)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                }}
              >
                ›
              </button>

              {/* Dots */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '6px',
                }}
              >
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    style={{
                      width: idx === current ? '10px' : '8px',
                      height: idx === current ? '10px' : '8px',
                      borderRadius: '50%',
                      backgroundColor: idx === current ? 'white' : 'rgba(255,255,255,0.6)',
                      border: '1px solid rgba(0,0,0,0.2)',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrent(idx);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* CONTENIDO */}
        <div style={style.content}>
          <div style={style.roomTitleRow}>
            <h2 style={style.roomName}>
              <FaBed /> Habitación {hab.numero || '—'}
            </h2>
            <span style={style.roomType}>{hab.tipo_nombre || 'Tipo no especificado'}</span>
          </div>

          <div style={style.featuresTopRow}>
            <div style={style.featureItem}>
              <FaUser /> {hab.capacidad_maxima || '-'} huéspedes
            </div>
            {hab.precio_base && (
              <div style={style.featureItem}>
                Desde {formatCLP(hab.precio_base)} / noche
              </div>
            )}
          </div>

          <ul style={style.descList}>
            {desc.map((line, idx) => (
              <li key={idx} style={style.descItem}>
                • {line}
              </li>
            ))}
          </ul>

          <div style={style.bottomRow}>
            <span style={style.priceText}>
              {hab.precio_base ? `Desde ${formatCLP(hab.precio_base)} / noche` : 'Consulte tarifa'}
            </span>
            <button
              style={style.reservarBtn}
              onClick={() => onReservar && onReservar(hab)}
            >
              Reservar <FaArrowRight size={12} />
            </button>
          </div>

          <div style={style.chipZona}>
            <FaTree /> {zonaLabel(hab.numero)}
          </div>

          <div style={{ marginTop: '8px', fontSize: '0.82rem', color: '#7A5A3A' }}>
            <span style={{ marginRight: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <FaWifi /> Wifi en espacios comunes
            </span>
            <span style={{ marginRight: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <FaCoffee /> Desayuno incluido
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <FaTree /> Entorno natural
            </span>
          </div>
        </div>
      </div>

      {/* OVERLAY EXPANDIDO */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
            }}
          >
            <img
              src={images[current]}
              alt={`Habitación ${hab.numero}`}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '10px',
              }}
            />

            {/* Cerrar */}
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                background: 'white',
                borderRadius: '50%',
                border: 'none',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ✕
            </button>

            {/* Flechas en modo expandido */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '-40px',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '50%',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={goNext}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '-40px',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '50%',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                  }}
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// ========================================================
//  PÁGINA PRINCIPAL
// ========================================================
const RoomsPage = ({ onReservar }) => {
  const [rooms, setRooms] = useState([]);
  const [status, setStatus] = useState('idle');
  const [errorDetail, setErrorDetail] = useState(null);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        setStatus('loading');
        setErrorDetail(null);
        const response = await api.get('/habitaciones/');
        setRooms(Array.isArray(response.data) ? response.data : []);
        setStatus('ok');
      } catch (err) {
        console.error('❌ Error cargando habitaciones:', err);
        setStatus('error');
        setErrorDetail(err);
      }
    };
    fetchHabitaciones();
  }, []);

  return (
    <div style={style.page}>
      {status === 'error' && (
        <div style={style.debugBox}>
          <strong>DEBUG HABITACIONES</strong>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(
              {
                message: errorDetail?.message,
                name: errorDetail?.name,
                response: errorDetail?.response?.status,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}

      <div style={style.headerWrapper}>
        <h1 style={style.title}>Nuestras Habitaciones</h1>
        <p style={style.subtitle}>
          Cada habitación del Hotel Bordeluz ha sido diseñada para combinar comodidad, calidez y una conexión única con el entorno natural.
        </p>
      </div>

      {status === 'loading' && (
        <p style={{ textAlign: 'center', marginTop: '80px', fontSize: '1.2rem', color: '#4A2A1A' }}>
          Cargando habitaciones...
        </p>
      )}

      {status === 'ok' && rooms.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '80px', fontSize: '1.2rem', color: '#4A2A1A' }}>
          No hay habitaciones registradas.
        </p>
      )}

      {status === 'ok' && rooms.length > 0 && (
        <div style={style.grid}>
          {rooms.map((hab) => (
            <RoomCard key={hab.id} hab={hab} onReservar={onReservar} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
