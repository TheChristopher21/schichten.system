import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/BewerbungsKalenderPage.module.css';
import { useNavigate } from "react-router-dom";

interface Application {
    id: string;
    schichtId: string;
    datum: string;
    anmerkung: string;
}

const SentApplicationsPage: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();

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
                if (savedTime && Date.now() - parseInt(savedTime) < 6000000000000000000) { // Check if token is still valid (10 minutes)
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


    if (loading) return <div>Lädt...</div>;
    if (error) return <div>{error}</div>;

    console.log(applications.at(0))

    return (
        <div className={styles.sentApplicationsPage}>
            <div className={styles.registerNavbar}>
                <a href="/">Home</a>
                {isLoggedIn && <a href="/CalendarEditPage">Kalender Bearbeiten</a>}
                {isLoggedIn && <a href="/SentApplicationsPage">Ausstehende Bewerbungen</a>}
                {!isLoggedIn && <a href="/Login">Login</a>}
                {!isLoggedIn && <a href="/Register">Registrieren</a>}
                {isLoggedIn && <button onClick={() => {
                    localStorage.removeItem('apikey');
                    localStorage.removeItem('loginTime');
                    setIsLoggedIn(false);
                    navigate('/');
                }}>Logout</button>}
                {isLoggedIn && <a href="/CalendarViewPage">Mitarbeiter Kalender</a>}
            </div>
            <h1>Gesendete Bewerbungen</h1>
            {loading ? (
                <div>Lädt...</div>
            ) : error ? (
                <div>{error}</div>
            ) : applications.length === 0 ? (
                <p>Keine Bewerbungen gesendet.</p>
            ) : (
                applications.map((application, index) => (
                    <div key={index}>
                        <p>Schicht ID: {application.schichtId}</p>
                        <p>Datum: {application.datum}</p>
                        <p>Anmerkung: {application.anmerkung}</p>
                        <button onClick={() => deleteApplication(application.schichtId)}>Löschen</button>
                    </div>
                ))
            )}
        </div>
    );
};
    export default SentApplicationsPage;
