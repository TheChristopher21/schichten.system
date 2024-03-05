import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import styles from './css/CalendarEditPage.module.css';

interface Shift {
    id: number | null | boolean;
    shiftid: string;
    date: string;
    text: string;
    user_id: string; // Aktualisiert, um der Datenbank zu entsprechen
}

interface NewShift {
    shiftid: string;
    date: string;
    text: string;
    user_id: string; // Hier wird nun 'user_id' als Teil des Typs definiert
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
    const [newShift, setNewShift] = useState<NewShift>({ shiftid: '', date: '', text: '', user_id: '' });
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [isEditing, setIsEditing] = useState(false);
    const [editingShift, setEditingShift] = useState<Shift | null>(null);
    const apiKey = localStorage.getItem('apikey'); // Anpassung an korrekten Schlüssel



    const api = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    });


    const handleLogout = () => {
        localStorage.removeItem('apikey'); // Entfernen des API-Keys beim Logout
        // Weiterleitung des Benutzers oder Aktualisierung des Zustands
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [shiftsResponse, usersResponse] = await Promise.all([
                    api.get<Shift[]>('/shift'),
                    api.get<User[]>('/user/userdetails')
                ]);
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
    }, [api]); // api in Abhängigkeiten aufnehmen



    const handleDeleteShift = async (shiftId: number | boolean | null) => {
        if (confirm("Möchten Sie diese Schicht wirklich löschen?")) {
            try {
                await api.delete(`/shift/${shiftId}`);
                setShifts(shifts.filter(shift => shift.id !== shiftId));
            } catch (error) {
                console.error('Fehler beim Löschen der Schicht', error);
            }
        }
    };


    class Modal extends React.Component<{ onClose: any, children: any }> {
        render() {
            let {onClose, children} = this.props;
            return (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <button onClick={onClose} className={styles.closeButton}>&times;</button>
                        {children}
                    </div>
                </div>
            );
        }
    }

    const getFormattedDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };


    const isShiftOpen = (shift: Shift) => {
        // Zuerst prüfen, ob userId definiert ist und dann als Zahl vergleichen
        return shift.user_id !== undefined && parseInt(shift.user_id) === -1;
    };


    const shiftToCreate = {
        ...newShift,
        // Verwenden Sie parseInt, um sicherzustellen, dass userId eine Zahl ist
        userId: newShift.user_id === 'open' ? -1 : parseInt(newShift.user_id)
    };


    const handleInputChange = useCallback((e: { target: { name: any; value: any; }; }) => {
        setEditingShift(prevShift => {
            if (!prevShift) return null;

            return {
                ...prevShift,
                [e.target.name]: e.target.value || '' // Stellen Sie sicher, dass keine undefined-Werte zugewiesen werden
            };
        });
    }, []);


    const handleEditShift = (shift: Shift) => {
        setIsEditing(true);
        setEditingShift(shift);
    };

    const handleUpdateShift = async () => {
        if (editingShift && editingShift.id !== null) {
            const shiftToUpdate = {
                ...editingShift,
                userId: editingShift.user_id === 'open' ? '-1' : editingShift.user_id
            };
            try {
                const response = await axios.put(`http://localhost:8080/shift/${editingShift.id}`, shiftToUpdate);
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

    const daysInWeek = getDaysInWeek(new Date(currentWeek)).map(getFormattedDate);

// Aktualisierte authenticateUser Funktion



    const addShift = async (event: React.FormEvent) => {
        event.preventDefault();
        const userIdValue = newShift.user_id === 'open' ? -1 : parseInt(newShift.user_id)

        const shiftToCreate = {
            shiftid: newShift.shiftid,
            date: newShift.date,
            text: newShift.text,
            user: newShift.user_id === 'open' ? null : { id: parseInt(newShift.user_id) } // Annahme, das Backend erwartet ein User-Objekt
        };

        try {
            const response = await api.post('/shift', shiftToCreate);
            setShifts([...shifts, response.data]);
            setNewShift({ shiftid: '', date: '', text: '', user_id: '' });
        } catch (error) {
            console.error('Fehler beim Hinzufügen der Schicht:', error);
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
                    value={newShift.user_id}
                    onChange={(e) => setNewShift({...newShift, user_id: e.target.value})}
                >
                    <option value="">Mitarbeiter auswählen</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.firstname} {user.lastname}</option>
                    ))}
                </select>
                <button type="submit">Schicht hinzufügen</button>
            </form>

            {isEditing && editingShift && (
                <Modal onClose={() => setIsEditing(false)}>
                    <div className={styles.editShiftForm}>
                        <h2>Schicht bearbeiten</h2>
                        <input
                            type="text"
                            value={editingShift.shiftid}
                            onChange={(e) => setEditingShift({...editingShift, shiftid: e.target.value})}
                        />
                        <input
                            type="date"
                            value={editingShift.date}
                            onChange={(
                                e) => setEditingShift({...editingShift, date: e.target.value})}
                        />
                        <input
                            type="text"
                            value={editingShift.text}
                            onChange={(e) => setEditingShift({...editingShift, text: e.target.value})}
                        />
                        <div className={styles.editShiftButtons}>
                            <button onClick={handleUpdateShift}>Speichern</button>
                            <button onClick={() => setIsEditing(false)}>Abbrechen</button>
                        </div>
                    </div>
                </Modal>
            )}
            <div className={styles.calendar}>
                <div className={styles.calendarHeader}>
                    <div className={styles.calendarCorner}></div>
                    {daysInWeek.map((day, index) => (
                        <div key={index} className={styles.calendarDay}>
                            {day}
                        </div>
                    ))}
                </div>

                {users.map(user => (
                    <div key={user.id} className={styles.calendarRow}>
                        <div className={styles.userName}>{user.firstname} {user.lastname}</div>
                        {daysInWeek.map((day, index) => (
                            <div key={index} className={styles.calendarCell}>
                                {shifts.filter(shift =>
                                    (user.id === 'open' ? isShiftOpen(shift) : shift.user_id === user.id) &&
                                    shift.date === day)
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
