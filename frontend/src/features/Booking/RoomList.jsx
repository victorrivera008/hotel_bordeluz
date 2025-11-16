import React from 'react';
import RoomList from './RoomList'; 
import { useAuth } from '../../context/AuthContext';
import { FaWifi, FaCoffee, FaTemperatureHigh, FaUser, FaExpand, FaTree, FaBed } from 'react-icons/fa'; 

const style = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0px 20px 60px 20px', 
        backgroundColor: '#F4E8D8',
        minHeight: '80vh',
    },
    header: {
        textAlign: 'center',
        color: '#4A2A1A',
        marginBottom: '50px',
    },
    title: {
        fontSize: '3rem',
        borderBottom: '3px solid #D4AF37',
        display: 'inline-block',
        paddingBottom: '10px',
    },
};

const BookingPage = ({ triggerLogin, searchData }) => {
    
    const { results: availableRooms, dates } = searchData;

    return (
        <div style={style.container}>


            {availableRooms.length > 0 && dates && (
                <RoomList 
                    rooms={availableRooms} 
                    checkIn={dates.checkIn} 
                    checkOut={dates.checkOut}
                    triggerLogin={triggerLogin} 
                />
            )}
        </div>
    );
};

export default BookingPage;