import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/CalendarViewPage.module.css';
import {useNavigate} from "react-router-dom";

interface Shift {
    id: number | null ;
    shiftid: string;
    date: string;
    text: string;
    userId?: string;
}

interface User {
    id: string;
    firstname: string;
    lastname: string;
}

const CalendarEditPage: React.FC = () => {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [additionalInfo, setAdditionalInfo] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [shiftsResponse, usersResponse] = await Promise.all([
                    axios.get<Shift[]>('http://localhost:8080/shift'),
                    axios.get<User[]>('http://localhost:8080/user/userdetails')
                ]);
                // Fügen Sie "Offene Schichten" als erste Option in der Nutzerliste hinzu
                const modifiedUsers = [{ id: 'open', firstname: 'Offene', lastname: 'Schichten' }, ...usersResponse.data];
                setUsers(modifiedUsers);
                setShifts(shiftsResponse.data);
            } catch (error) {
                setError('Fehler beim Abrufen der Daten');
                console.error('Fehler beim Abrufen der Daten: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSpecialUser, setIsSpecialUser] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const apiKey = localStorage.getItem('apikey');
        const userRole = localStorage.getItem('userRole');

        setIsLoggedIn(!!apiKey);
        setIsSpecialUser(userRole === 'special');

        if (apiKey) {
            fetchUsername(apiKey);
        }
        console.log(apiKey)
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('apikey');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setIsSpecialUser(false);
        navigate('/'); // Navigieren zur Startseite nach dem Logout
    };

    const fetchUsername = async (token: string) => {
        try {
            const response = await axios.get('http://localhost:8080/user/getUsername', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsername(response.data);
        } catch (error) {
            console.error('Fehler beim Abrufen des Benutzernamens:', error);
        }
    };

    const getUsername = async (token: string) => {
        try {
            const response = await axios.get('http://localhost:8080/getUsername', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data; // Annahme, dass das Backend den Benutzernamen zurückgibt
        } catch (error) {
            console.error('Fehler beim Abrufen des Benutzernamens:', error);
            return null; // oder eine angemessene Fehlerbehandlung
        }
    }

    const handleApply = async () => {
        if (selectedShift) {
            try {
                const token = localStorage.getItem('userToken');
                if (!token) {
                    console.error('Kein Token gefunden');
                    return;
                }

                // Benutzername abrufen
                const bewerberName = await getUsername(token);
                if (!bewerberName) {
                    console.error('Benutzername konnte nicht abgerufen werden');
                    return;
                }

                const applicationData = {
                    shiftId: selectedShift.id,
                    bewerberName: bewerberName,
                    datum: selectedShift.date,
                    anmerkung: additionalInfo,
                };

                const response = await axios.post('http://localhost:8080/bewerbungen/apply', applicationData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Bewerbung erfolgreich gesendet:', response.data);
            } catch (error) {
                console.error('Fehler beim Senden der Bewerbung:', error);
            }
        }
    };

    const handleClosePopup = () => {
        setSelectedShift(null);
        setAdditionalInfo('');
    };

    const handleApplyClick = (shift: Shift) => {
        setSelectedShift(shift);
    };
    const getDaysInWeek = (date: Date) => {
        let start = new Date(date.setDate(date.getDate() - date.getDay()));
        return new Array(7).fill(null).map((_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
    };

    const handlePreviousWeek = () => {
        setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)));
    };

    const handleNextWeek = () => {
        setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)));
    };

    const daysInWeek = getDaysInWeek(new Date(currentWeek)).map(date => date.toISOString().split('T')[0]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const isShiftOpen = (shift: Shift) => {
        return shift.userId === undefined || parseInt(shift.userId) === -1;
    };



    return (
        <div className={styles.calendarEditPage}>
            <div className={styles.registerNavbar}>
                <a href="/">Home</a>
                {isLoggedIn && <a href="/CalendarEditPage">Kalender Bearbeiten</a>}
                {isSpecialUser && <a href="/BewerbungsKalenderPage">Ausstehende Bewerbungen</a>}
                {!isLoggedIn && <a href="/Login">Login</a>}
                {!isLoggedIn && <a href="/Register">Registrieren</a>}
                {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
                {isLoggedIn && <a href="/CalendarViewPage">Mitarbeiter Kalender</a>}
            </div>
            <h1>Shift Calendar</h1>
            <div className={styles.weekNavigation}>
                <button onClick={handlePreviousWeek}>Vorherige Woche</button>
                <button onClick={handleNextWeek}>Nächste Woche</button>
            </div>

            <div className={styles.calendar}>
                <div className={styles.calendarHeader}>
                    <div className={styles.calendarCorner}></div>
                    {daysInWeek.map((day, index) => {
                        const formattedDay = new Date(day).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' });
                        return (
                            <div key={index} className={styles.calendarDay}>
                                {formattedDay}
                            </div>
                        );
                    })}
                </div>

                {users.map(user => (
                    <div key={user.id} className={styles.calendarRow}>
                        <div className={styles.userName}>{user.firstname} {user.lastname}</div>
                        {daysInWeek.map((day, index) => (
                            <div key={index} className={styles.calendarCell}>
                                     {shifts.filter(shift =>
                                    (user.id === 'open' ? isShiftOpen(shift) : shift.userId === user.id) &&
                                    shift.date === day)
                                    .map((shift, shiftIndex) => (
                                        <div key={shiftIndex} className={styles.shift}>
                                            <div><strong>ID:</strong> {shift.shiftid}</div>
                                            <div><strong>Date:</strong> {shift.date}</div>
                                            <div><strong>Text:</strong> {shift.text}</div>
                                            <button onClick={() => handleApplyClick(shift)}>Bewerben</button>
                                        </div>
                                    ))
                                }
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {selectedShift && (
                <div className={styles.applyPopup}>
                    <h2>Bewerbung für Schicht:</h2>
                    <div><strong>ID:</strong> {selectedShift.shiftid}</div>
                    <div><strong>Date:</strong> {selectedShift.date}</div>
                    <div><strong>Text:</strong> {selectedShift.text}</div>
                    <textarea
                        placeholder="Zusätzliche Informationen zur Bewerbung..."
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                    />
                    <button onClick={handleApply}>Jetzt bewerben</button>
                    <button onClick={handleClosePopup}>Abbrechen</button> {/* Abbrechen-Button */}

                </div>
            )}
        </div>
    );
};

export default CalendarEditPage;
