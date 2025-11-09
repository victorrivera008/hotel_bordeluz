// frontend/hotel-bordeluz-ui/src/components/Register.jsx
import React, { useState } from 'react';
import api from '../services/api';

const Register = ({ onSwitchToLogin, onRegistrationSuccess }) => {
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', first_name: '', last_name: '', telefono: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {

            await api.post('/auth/register/', formData);
            
            alert("Registro exitoso! Por favor, inicia sesión con tu nueva cuenta.");
            
            if (onRegistrationSuccess) onRegistrationSuccess(); 

        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data) {
                const errorMsg = Object.entries(err.response.data)
                                    .map(([key, value]) => `${key}: ${value.join(' ')}`).join(' | ');
                setError(`Error de validación: ${errorMsg}`);
            } else {
                setError('Ocurrió un error al intentar registrar la cuenta.');
            }
            console.error("Error de Registro:", err.response || err);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2 style={{color: '#D4AF37'}}>Crear Cuenta</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Usuario (Requerido)" required onChange={handleChange} style={{ width: '100%', padding: '8px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
                <input type="email" name="email" placeholder="Email (Requerido)" required onChange={handleChange} style={{ width: '100%', padding: '8px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
                <input type="password" name="password" placeholder="Contraseña (Requerido)" required onChange={handleChange} style={{ width: '100%', padding: '8px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
                <input type="text" name="first_name" placeholder="Nombre" onChange={handleChange} style={{ width: '100%', padding: '8px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
                <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} style={{ width: '100%', padding: '8px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
                
                <button type="submit" disabled={loading} style={{ padding: '10px', width: '100%', backgroundColor: loading ? '#ccc' : '#4A2A1A', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', margin: '15px 0' }}>
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>

            <button onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: '#4A2A1A', cursor: 'pointer', textDecoration: 'underline' }}>
                Ya tengo cuenta (Volver a Login)
            </button>
        </div>
    );
};

export default Register;