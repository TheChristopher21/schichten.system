import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/BewerbungsKalenderPage.module.css';

// Angenommen, wir haben eine Bewerbungsstruktur, die vom Backend zurückgegeben wird
interface Bewerbung {
    id: number;
    schichtId: string;
    datum: string;
    anmerkung: string;
    bewerberName: string;
}

const BewerbungsKalenderPage: React.FC = () => {
    const [bewerbungen, setBewerbungen] = useState<Bewerbung[]>([]);
    const [currentWeek, setCurrentWeek] = useState(new Date());

    useEffect(() => {
        const fetchBewerbungen = async () => {
            try {
                const response = await axios.get<Bewerbung[]>('http://localhost:8080/bewerbungen');
                setBewerbungen(response.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Bewerbungen:', error);
            }
        };

        fetchBewerbungen();
    }, [currentWeek]); // Abhängigkeit von currentWeek, um die Daten bei Änderung der Woche neu zu laden



    const handlePreviousWeek = () => {
        setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)));
    };

    const handleNextWeek = () => {
        setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)));
    };

    const getDaysInWeek = (date: Date) => {
        let start = new Date(date.setDate(date.getDate() - date.getDay()));
        return new Array(7).fill(null).map((_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
    };

    const daysInWeek = getDaysInWeek(new Date(currentWeek));

    return (
        <div className={styles.bewerbungsKalenderPage}>
            <div className={styles.registerNavbar}>
                <a href="App.tsx">Home</a>
                <a href="">Neuigkeiten</a>
                <a href="CalendarEditPage">EditPage</a>


            </div>
            <h1>Bewerbungen Kalender</h1>

            <div className={styles.weekNavigation}>
                <button onClick={handlePreviousWeek}>Vorherige Woche</button>
                <button onClick={handleNextWeek}>Nächste Woche</button>
            </div>

            <div className={styles.calendar}>
                <div className={styles.calendarHeader}>
                    {daysInWeek.map((day, index) => (
                        <div key={index} className={styles.calendarDay}>
                            {day.toLocaleDateString('de-DE', {weekday: 'short', day: 'numeric', month: 'numeric'})}
                        </div>
                    ))}
                </div>

                <div className={styles.bewerbungenContainer}>
                    {bewerbungen.map(bewerbung => (
                        <div key={bewerbung.id}
                             className={styles.bewerbung}> {/* Achten Sie auf die key-Eigenschaft hier */}
                            <div><strong>ID:</strong> {bewerbung.schichtId}</div>
                            <div><strong>Datum:</strong> {bewerbung.datum}</div>
                            <div><strong>Bewerber:</strong> {bewerbung.bewerberName}</div>
                            <div><strong>Anmerkung:</strong> {bewerbung.anmerkung}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BewerbungsKalenderPage;
