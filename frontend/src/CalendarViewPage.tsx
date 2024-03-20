import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/CalendarViewPage.module.css';
import { useNavigate } from "react-router-dom";

interface User {
    id: string;
    firstname: string;
    lastname: string;
}

interface Shift {
    id: number | null;
    shiftid: string;
    date: string;
    text: string;
    user: any;
}

const CalendarViewPage: React.FC = () => {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [additionalInfo, setAdditionalInfo] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState("");
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const api = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    });


    api.interceptors.request.use(config => {
        if (apiKey) {
            config.headers.Authorization = `Bearer ${apiKey}`;
        }
        return config;
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiKeyFromLocalStorage = localStorage.getItem('apikey');
                if (apiKeyFromLocalStorage) {
                    setApiKey(apiKeyFromLocalStorage);
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }

                const [shiftsResponse, usersResponse] = await Promise.all([
                    api.get<Shift[]>('/shift'),
                    api.get<User[]>('/user/userdetails')
                ]);

                setUsers(usersResponse.data);
                setShifts(shiftsResponse.data);
            } catch (error) {
                setError('Fehler beim Abrufen der Daten');
                console.error('Fehler beim Abrufen der Daten: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiKey]);



    const navigate = useNavigate();

    const getDaysInWeek = (date: Date) => {
        let start = new Date(date.setDate(date.getDate() - date.getDay()));
        return new Array(7).fill(null).map((_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
    };


    const handleApply = async () => {
        if (selectedShift) {
            try {
                const applicationData = {
                    shiftId: selectedShift.id,
                    datum: selectedShift.date,
                    anmerkung: additionalInfo,
                };

                const response = await api.post('http://localhost:8080/bewerbungen/apply', applicationData);
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

    const handlePreviousWeek = () => {
        setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)));
    };

    const handleNextWeek = () => {
        setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)));
    };

    const daysInWeek = getDaysInWeek(new Date(currentWeek)).map(date => date.toISOString().split('T')[0]);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        navigate('/');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={styles.calendarEditPage}>
            <div className={styles.registerNavbar}>
                <a href="/">Home</a>
                {isLoggedIn && <a href="/CalendarEditPage">Kalender Bearbeiten</a>}
                {/* Die folgende Zeile wurde geändert */}
                {isLoggedIn  && <a href="/BewerbungsKalenderPage">Ausstehende Bewerbungen</a>}
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
                                    ((shift.user ? shift.user.id : "welp") === user.id && shift.date === day))
                                    .map((shift, shiftIndex) => (
                                        <div key={shiftIndex} className={styles.shift}>
                                            <div><strong>ID:</strong> {shift.shiftid}</div>
                                            <div><strong>Date:</strong> {shift.date}</div>
                                            <div><strong>Text:</strong> {shift.text}</div>
                                            <button onClick={() => handleApplyClick(shift)}>Bewerben</button>
                                        </div>
                                    ))}
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

export default CalendarViewPage;