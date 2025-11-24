// frontend/src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  FaUser,
  FaWifi,
  FaCoffee,
  FaBed,
  FaTree,
  FaArrowRight,
  FaExpand,
} from 'react-icons/fa';

const style = {
  mainContainer: {
    minHeight: '80vh',
    fontFamily: 'Georgia, serif',
    backgroundColor: '#F4E8D8',
  },

  // HERO
  heroSection: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundImage:
      'url(https://www.hotelbordeluz.cl/en/wp-content/uploads/2020/11/slide-h.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '40px 20px',
  },
  heroOverlay: {
    maxWidth: '900px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '40px 50px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    textAlign: 'left',
  },
  heroTitle: {
    fontSize: '3rem',
    margin: 0,
    marginBottom: '10px',
    color: '#4A2A1A',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    color: '#6A4832',
    margin: 0,
    marginBottom: '20px',
  },
  heroText: {
    fontSize: '1rem',
    color: '#4A2A1A',
    lineHeight: 1.6,
    marginBottom: '25px',
  },
  heroButtonsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  primaryButton: {
    backgroundColor: '#D4AF37',
    color: 'white',
    border: 'none',
    padding: '12px 22px',
    borderRadius: '30px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#4A2A1A',
    border: '1px solid #4A2A1A',
    padding: '11px 20px',
    borderRadius: '30px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },

  // SECCIÓN ABOUT
  section: {
    padding: '60px 20px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  sectionTitleWrapper: {
    textAlign: 'center',
    marginBottom: '35px',
  },
  sectionTitle: {
    textAlign: 'center',
    color: '#4A2A1A',
    fontSize: '2.2rem',
    marginBottom: '10px',
    position: 'relative',
    display: 'inline-block',
  },
  sectionTitleUnderline: {
    width: '80px',
    height: '3px',
    backgroundColor: '#D4AF37',
    margin: '10px auto 0',
    borderRadius: '999px',
  },
  sectionTextRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.3fr',
    gap: '40px',
    alignItems: 'center',
  },
  sectionText: {
    color: '#4A2A1A',
    fontSize: '1rem',
    lineHeight: 1.8,
  },
  highlightBox: {
    backgroundColor: '#FFF7E3',
    borderRadius: '14px',
    padding: '20px 22px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    color: '#4A2A1A',
    fontSize: '0.95rem',
    lineHeight: 1.7,
  },
  highlightTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  highlightList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  highlightItem: {
    marginBottom: '6px',
  },

  // HABITACIONES DESTACADAS
  featuredSection: {
    padding: '60px 20px 80px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '28px',
    marginTop: '25px',
  },
  roomCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  },
  roomCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 22px rgba(0,0,0,0.15)',
  },
  cardImageWrapper: {
    width: '100%',
    height: '190px',
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  cardImage: {
    width: '100%',
    height: '190px',
    objectFit: 'cover',
  },
  cardContent: {
    padding: '18px 20px 20px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    color: '#4A2A1A',
    fontSize: '1.4rem',
    marginBottom: '4px',
    fontFamily: 'Georgia, serif',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  cardSubtitle: {
    fontSize: '0.9rem',
    color: '#8A6A4A',
    marginBottom: '8px',
    fontStyle: 'italic',
  },
  cardFeatures: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px',
    marginBottom: '12px',
    fontSize: '0.85rem',
    color: '#666',
    paddingBottom: '10px',
    borderBottom: '1px solid #EEE',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  includeList: {
    listStyle: 'none',
    padding: 0,
    margin: '10px 0 0',
    flexGrow: 1,
  },
  includeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
    color: '#4A2A1A',
    fontSize: '0.9rem',
  },
  cardFooter: {
    marginTop: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  },
  priceTag: {
    backgroundColor: '#D4AF37',
    color: 'white',
    padding: '9px 14px',
    borderRadius: '5px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  smallLinkButton: {
    border: 'none',
    background: 'transparent',
    color: '#4A2A1A',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    textDecoration: 'underline',
  },
};

const DESTACADAS = [101, 106, 108];

const getHabitacionImage = (hab) => {
  if (!hab?.numero) {
    return 'https://via.placeholder.com/400x250/69422F/FFFFFF?text=Habitaci%C3%B3n';
  }
  return `/imagenes/h${hab.numero}.jpg`;
};

const Home = ({ triggerLogin, onVerHabitaciones }) => {
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const res = await api.get('/habitaciones/');
        const filtradas = (res.data || [])
          .filter((h) => DESTACADAS.includes(parseInt(h.numero)))
          .sort((a, b) => parseInt(a.numero) - parseInt(b.numero));
        setRooms(filtradas);
      } catch (err) {
        console.error('Error cargando habitaciones destacadas:', err);
        setRooms([]);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  const formatCLP = (amount) => {
    if (amount == null) return '';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const scrollToFeatured = () => {
    const el = document.getElementById('habitaciones-destacadas');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleVerHabitaciones = (numero) => {
    if (onVerHabitaciones) {
      onVerHabitaciones(numero || null);
    } else {
      scrollToFeatured();
    }
  };

  return (
    <div style={style.mainContainer}>
      {/* HERO */}
      <section style={style.heroSection}>
        <div style={style.heroOverlay}>
          <h1 style={style.heroTitle}>Hotel Bordeluz</h1>
          <h2 style={style.heroSubtitle}>Experiencia boutique en Villarrica, Chile</h2>
          <p style={style.heroText}>
            Despierta con el sonido de la naturaleza, disfruta de un desayuno preparado
            con productos locales y relájate en habitaciones diseñadas para tu máximo
            descanso. Bordeluz combina el encanto del sur de Chile con un servicio
            cálido y cercano.
          </p>
          <div style={style.heroButtonsRow}>
            <button
              type="button"
              style={style.primaryButton}
              onClick={() => handleVerHabitaciones(null)}
            >
              Ver habitaciones <FaArrowRight />
            </button>
            <button
              type="button"
              style={style.secondaryButton}
              onClick={scrollToFeatured}
            >
              Conoce más sobre el hotel
            </button>
          </div>
        </div>
      </section>

      {/* SOBRE EL HOTEL */}
      <section style={style.section}>
        <div style={style.sectionTitleWrapper}>
          <h2 style={style.sectionTitle}>Un refugio acogedor en el sur de Chile</h2>
          <div style={style.sectionTitleUnderline}></div>
        </div>

        <div style={style.sectionTextRow}>
          <p style={style.sectionText}>
            En Hotel Bordeluz buscamos que cada estadía se sienta como una pausa del
            ritmo diario. Nuestro entorno natural, la calidez del equipo y la atención a
            los detalles convierten tu visita en una experiencia memorable, ya sea que
            vengas por descanso, trabajo o turismo.
            <br />
            <br />
            Estamos ubicados en un punto estratégico para explorar lagos, volcanes y
            rutas gastronómicas de la zona, mientras disfrutas de un ambiente tranquilo
            y seguro.
          </p>

          <div style={style.highlightBox}>
            <div style={style.highlightTitle}>¿Qué encontrarás en Bordeluz?</div>
            <ul style={style.highlightList}>
              <li style={style.highlightItem}>• Habitaciones cómodas con diseño cálido.</li>
              <li style={style.highlightItem}>• Desayuno incluido con productos locales.</li>
              <li style={style.highlightItem}>• Áreas verdes y espacios para desconectarte.</li>
              <li style={style.highlightItem}>• Wifi, estacionamiento y atención personalizada.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* HABITACIONES DESTACADAS */}
      <section id="habitaciones-destacadas" style={style.featuredSection}>
        <div style={style.sectionTitleWrapper}>
          <h2 style={style.sectionTitle}>Habitaciones destacadas</h2>
          <div style={style.sectionTitleUnderline}></div>
        </div>

        {loadingRooms ? (
          <p style={{ textAlign: 'center', padding: '40px 0', color: '#4A2A1A' }}>
            Cargando habitaciones destacadas...
          </p>
        ) : rooms.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px 0', color: '#4A2A1A' }}>
            No se encontraron las habitaciones destacadas 101, 106 y 108.
          </p>
        ) : (
          <div style={style.cardGrid}>
            {rooms.map((hab) => (
              <div
                key={hab.id}
                style={{
                  ...style.roomCard,
                  ...(hoveredId === hab.id ? style.roomCardHover : {}),
                }}
                onMouseEnter={() => setHoveredId(hab.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleVerHabitaciones(hab.numero)} // 👈 Va a RoomsPage + scroll
              >
                <div style={style.cardImageWrapper}>
                  <img
                    src={getHabitacionImage(hab)}
                    alt={`Habitación ${hab.numero}`}
                    style={style.cardImage}
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/400x250/69422F/FFFFFF?text=Habitaci%C3%B3n';
                    }}
                  />
                </div>

                <div style={style.cardContent}>
                  <h3 style={style.cardTitle}>
                    <FaBed /> Habitación {hab.numero}
                  </h3>
                  <div style={style.cardSubtitle}>
                    {hab.tipo_nombre || 'Tipo de habitación'}
                  </div>

                  <div style={style.cardFeatures}>
                    <span style={style.featureItem}>
                      <FaUser color="#D4AF37" /> {hab.capacidad_maxima || '-'} huéspedes
                    </span>
                    <span style={style.featureItem}>
                      <FaWifi color="#D4AF37" /> Wifi de cortesía
                    </span>
                    <span style={style.featureItem}>
                      <FaTree color="#D4AF37" /> Entorno natural
                    </span>
                  </div>

                  <ul style={style.includeList}>
                    <li style={style.includeItem}>
                      <FaCoffee /> Desayuno incluido
                    </li>
                    <li style={style.includeItem}>
                      <FaExpand /> Ambiente amplio y luminoso
                    </li>
                  </ul>

                  <div style={style.cardFooter}>
                    <span style={style.priceTag}>
                      {hab.precio_base
                        ? `Desde ${formatCLP(hab.precio_base)} / noche`
                        : 'Consulte tarifa'}
                    </span>

                    <button
                      type="button"
                      style={style.smallLinkButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerHabitaciones(hab.numero);
                      }}
                    >
                      Ver detalles <FaArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
