import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/CalendarEditPage.module.css';

interface Shift {
    id: number | null;
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [shiftsResponse, usersResponse] = await Promise.all([
                    axios.get<Shift[]>('http://localhost:8080/shift'),
                    axios.get<User[]>('http://localhost:8080/user/userdetails')
                ]);
                setShifts(shiftsResponse.data);
                setUsers(usersResponse.data);
            } catch (error) {
                setError('Error fetching data');
                console.error('Error fetching data: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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

    const daysInWeek = getDaysInWeek(new Date(currentWeek));

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={styles.calendarEditPage}>
            <div className={styles.registerNavbar}>
                <a href="App.tsx">Home</a>
                <a href="CalendarViewPage">Mitarbeiter Kalender</a>

            </div>
            <h1>Shift Calendar</h1>
            <div className={styles.weekNavigation}>
                <button onClick={handlePreviousWeek}>Vorherige Woche</button>
                <button onClick={handleNextWeek}>Nächste Woche</button>
            </div>

            <div className={styles.calendar}>
                <div className={styles.calendarHeader}>
                    <div className={styles.calendarCorner}></div>
                    {daysInWeek.map((day, index) => (
                        <div key={index} className={styles.calendarDay}>
                            {day.toLocaleDateString('de-DE', {weekday: 'short', day: 'numeric', month: 'numeric'})}
                        </div>
                    ))}
                </div>

                {users.map(user => (
                    <div key={user.id} className={styles.calendarRow}>
                        <div className={styles.userName}>{user.firstname} {user.lastname}</div>
                        {daysInWeek.map((day, index) => (
                            <div key={index} className={styles.calendarCell}>
                                {shifts.filter(shift => shift.userId === user.id && shift.date === day.toISOString().split('T')[0])
                                    .map((shift, shiftIndex) => (
                                        <div key={shiftIndex} className={styles.shift}>
                                            <div><strong>ID:</strong> {shift.shiftid}</div>
                                            <div><strong>Date:</strong> {shift.date}</div>
                                            <div><strong>Text:</strong> {shift.text}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarEditPage;
