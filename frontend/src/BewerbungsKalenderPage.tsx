import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/BewerbungsKalenderPage.module.css';
import { useNavigate } from "react-router-dom";

interface Application {
    schichtId: string;
    datum: string;
    anmerkung: string;
    bewerberName: string; // Geändert von bewerber_name zu bewerberName
}
``


const SentApplicationsPage: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();
    const [currentWeek, setCurrentWeek] = useState(new Date());

    const api = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    useEffect(() => {
        const fetchApiKey = () => {
            const apiKeyFromLocalStorage = localStorage.getItem('apikey');
            if (apiKeyFromLocalStorage) {
                const savedTime = localStorage.getItem('loginTime');
                if (savedTime && Date.now() - parseInt(savedTime) < 6000000) { // Check if token is still valid (10 minutes)
                    setApiKey(apiKeyFromLocalStorage);
                    setIsLoggedIn(true);
                } else {
                    localStorage.removeItem('apikey');
                    localStorage.removeItem('loginTime');
                    setIsLoggedIn(false);
                    navigate('/Login'); // Leite den Benutzer zur Login-Seite weiter
                }
            } else {
                setIsLoggedIn(false);
                navigate('/Login'); // Leite den Benutzer zur Login-Seite weiter
            }
        };

        fetchApiKey();
    }, [navigate]);

    useEffect(() => {
        if (!apiKey) return;
        const fetchApplications = async () => {
            try {
                const response = await api.get<Application[]>('/bewerbungen/sent', {
                    headers: {Authorization: `Bearer ${apiKey}`},
                });
                setApplications(response.data);
            } catch (error) {
                setError('Fehler beim Abrufen der gesendeten Bewerbungen');
                console.error('Fehler beim Abrufen der gesendeten Bewerbungen: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [apiKey]);

    const deleteApplication = async (schichtId: string) => {
        if (!apiKey || !schichtId) {
            console.error('API-Key oder Schicht-ID fehlt');
            return;
        }
        try {
            await api.delete(`/bewerbungen/bySchicht/${schichtId}`, {
                headers: {Authorization: `Bearer ${apiKey}`},
            });
            setApplications(applications.filter(application => application.schichtId !== schichtId));
            console.log("Bewerbung erfolgreich gelöscht");
        } catch (error) {
            setError('Fehler beim Löschen der Bewerbung');
            console.error('Fehler beim Löschen der Bewerbung: ', error);
        }
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

    if (loading) return <div>Lädt...</div>;
    if (error) return <div>{error}</div>;

    console.log(applications.at(0))
    console.log(applications)
    return (
        <div className={styles.sentApplicationsPage}>
            <h1>Gesendete Bewerbungen</h1>
            <div className={styles.weekNavigation}>
                <button onClick={handlePreviousWeek}>Vorherige Woche</button>
                <button onClick={handleNextWeek}>Nächste Woche</button>
            </div>
            <div className={styles.calendar}>
                <div className={styles.calendarHeader}>
                    {/* Kalenderkopf wie zuvor */}
                    {daysInWeek.map((day, index) => {
                        const formattedDay = new Date(day).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' });
                        return <div key={index} className={styles.calendarDay}>{formattedDay}</div>;
                    })}
                </div>
                {/* Kalenderzellen für Bewerbungen */}
                <div className={styles.calendarRow}>
                    {daysInWeek.map((day) => (
                        <div key={day} className={styles.calendarCell}>
                            {applications.filter(application => application.datum === day).map((application, index) => (
                                <div key={index} className={styles.application}>
                                    <p>Datum: {application.datum}</p>
                                    <p>Bewerber: {application.bewerberName}</p>
                                    <p>Schicht ID: {application.schichtId}</p>
                                    <p>Anmerkung: {application.anmerkung}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SentApplicationsPage;
