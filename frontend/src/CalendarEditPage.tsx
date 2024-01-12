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

// Typdefinition für den neuen Schichtzustand
interface NewShift {
    shiftid: string;
    date: string;
    text: string;
    userId: string; // Hier wird nun 'userId' als Teil des Typs definiert
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
    const [newShift, setNewShift] = useState<NewShift>({ shiftid: '', date: '', text: '', userId: '' });
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [isEditing, setIsEditing] = useState(false);
    const [editingShift, setEditingShift] = useState<Shift | null>(null);





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

    const handleDeleteShift = async (shiftId: number | null) => {
        // Zeige ein Bestätigungsdialog an
        const confirmDelete = window.confirm("Möchten Sie diese Schicht wirklich löschen?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8080/shift/${shiftId}`);
                setShifts(shifts.filter(shift => shift.id !== shiftId));
            } catch (error) {
                console.error('Fehler beim Löschen der Schicht', error);
            }
        }
    };




    const handleEditShift = (shift: Shift) => {
        setIsEditing(true);
        const editedShift = {
            ...shift,
            id: shift.id ?? null // Stellt sicher, dass id entweder number oder null ist, aber nicht undefined
        };
        setEditingShift(editedShift);
    };


    const handleUpdateShift = async () => {
        if (editingShift && editingShift.id !== null) { // Überprüfen Sie, ob editingShift nicht null ist und eine gültige ID hat
            try {
                const response = await axios.put(`http://localhost:8080/shift/${editingShift.id}`, editingShift);
                setShifts(shifts.map(shift => shift.id === editingShift.id ? response.data : shift));
                setIsEditing(false);
                setEditingShift(null);
            } catch (error) {
                console.error('Fehler beim Aktualisieren der Schicht', error);
            }
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

    const daysInWeek = getDaysInWeek(new Date(currentWeek));

    const addShift = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/shift', newShift);
            setShifts([...shifts, response.data]);
            setNewShift({ shiftid: '', date: '', text: '', userId: '' });
        } catch (error) {
            console.error('Fehler beim Hinzufügen der Schicht', error);
        }
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
                <a href="App.tsx">Home</a>
                <a href="CalendarViewPage">Mitarbeiter Kalender</a>
                <a href="BewerbungsKalenderPage">Ausstehende Bewerbungen</a>

            </div>
            <h1>Shift Calendar</h1>
            <div className={styles.weekNavigation}>
                <button onClick={handlePreviousWeek}>Vorherige Woche</button>
                <button onClick={handleNextWeek}>Nächste Woche</button>
            </div>

            <form onSubmit={addShift} className={styles.addShiftForm}>
                {/* Formularfelder */}
                <input
                    type="text"
                    placeholder="Shift ID"
                    value={newShift.shiftid}
                    onChange={(e) => setNewShift({...newShift, shiftid: e.target.value})}
                />
                <input
                    type="date"
                    value={newShift.date}
                    onChange={(e) => setNewShift({...newShift, date: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Shift Text"
                    value={newShift.text}
                    onChange={(e) => setNewShift({...newShift, text: e.target.value})}
                />
                <select
                    value={newShift.userId}
                    onChange={(e) => setNewShift({...newShift, userId: e.target.value})}
                >
                    <option value="">Mitarbeiter auswählen</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.firstname} {user.lastname}</option>
                    ))}
                </select>
                <button type="submit">Schicht hinzufügen</button>
            </form>

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
                                            <button onClick={() => handleEditShift(shift)}>Bearbeiten</button>
                                            <button onClick={() => handleDeleteShift(shift.id)}>Löschen</button>
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
