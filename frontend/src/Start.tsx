import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from "./css/Register.module.css";

function Start() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        const role = localStorage.getItem('userRole') || '';
        setIsLoggedIn(!!token);
        setUserRole(role);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUserRole('');
        navigate('/'); // Zurück zur Startseite navigieren
    };

    return (
        <div className="App">
            <div className="content">
                <div className={styles.registerNavbar}>
                    <Link to="/">Home</Link>
                    {userRole === 'special' && <Link to="/CalendarEditPage">EditPage</Link>}
                    {userRole === 'special' && <Link to="/BewerbungsKalenderPage">Ausstehende Bewerbungen</Link>}
                    {!isLoggedIn ? (
                        <>
                            <Link to="/Login">Login</Link>
                            <Link to="/Register">Registrieren</Link>
                        </>
                    ) : (
                        <button onClick={handleLogout}>Logout</button>
                    )}
                    {isLoggedIn && <Link to="/CalendarViewPage">Mitarbeiter Kalender</Link>}
                </div>
                <h1>Willkommen im SeedammPlaza!</h1>
            </div>
        </div>
    );
}

export default Start;
