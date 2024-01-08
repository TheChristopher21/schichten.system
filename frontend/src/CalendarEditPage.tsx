import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/CalendarEditPage.module.css';
interface Shift {
    id: number | null; // ID kann entweder eine Zahl oder null sein
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
    const [newShiftText, setNewShiftText] = useState('');
    const [newShiftId, setNewShiftId] = useState('');
    const [newShiftDate, setNewShiftDate] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; // Wochentage aktualisiert


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [shiftsResponse, usersResponse] = await Promise.all([
                    axios.get<Shift[]>('http://localhost:8080/shift'),
                    axios.get<User[]>('http://localhost:8080/user/userdetails')
                ]);
                console.log("Shifts data:", shiftsResponse.data);
                console.log("Users data:", usersResponse.data);
                setShifts(shiftsResponse.data);
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        fetchData().catch(() => {
            console.log("daten konnten nicht abgefragt werden")

        });
    }, []);
    // Funktion, um Schichten nach Benutzer und Wochentagen zu gruppieren
    const groupShiftsByUserAndDay = () => {
        const groupedShifts: Record<string, Record<string, Shift[]>> = {};
        users.forEach(user => {
            groupedShifts[user.id] = {};
            weekDays.forEach(day => {
                groupedShifts[user.id][day] = shifts.filter(shift =>
                    shift.userId === user.id.toString() && shift.date === day);
            });
        });
        return groupedShifts;
    };

    const groupedShifts = groupShiftsByUserAndDay();
    const handleAssignShift = async () => {
        if (!newShiftId || !newShiftText || !newShiftDate || !selectedUserId) {
            console.error('Please fill out all fields.');
            return;
        }

        const selectedDate = new Date(newShiftDate);
        const selectedDay = selectedDate.getDay();
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = weekDays[selectedDay];

        const newShift: Shift = {
            id: 0, // Hier setzen Sie die ID auf eine Zahl
            shiftid: newShiftId,
            date: dayOfWeek,
            text: newShiftText,
            userId: selectedUserId,
        };




        try {
            const response = await axios.post('http://localhost:8080/shift', newShift);
            const addedShift = response.data;
            setShifts([...shifts, addedShift]);
            setNewShiftText('');
            setNewShiftId('');
            setNewShiftDate('');
            setSelectedUserId('');
            console.log('Shift assigned successfully.');

            // Aktualisierung der Schichtendaten von der API
            const shiftResponse = await axios.get<Shift[]>('http://localhost:8080/shift');
            setShifts(shiftResponse.data);
        } catch (error) {
            console.error('Error assigning shift: ', error);
        }

    };
    const handleEdit = (shiftId: number, field: string, newValue: string | number) => {
        const updatedShifts = shifts.map((shift) =>
            shift.id === shiftId ? {...shift, [field]: newValue.toString()} : shift
        );
        setShifts(updatedShifts);
    };
    const handleSave = async (shiftId: number, newText: string) => {
        try {
            const shiftToUpdate = shifts.find((shift) => shift.id === shiftId);
            if (shiftToUpdate) {
                const updatedShift = {...shiftToUpdate, text: newText};
                await axios.put(`http://localhost:8080/shift/${shiftId}`, updatedShift);
                console.log('Shift updated successfully.');
                const response = await axios.get<Shift[]>('http://localhost:8080/shift');
                setShifts(response.data);
            }
        } catch (error) {
            console.error('Error updating shift: ', error);
        }
    };

    const handleDelete = async (shiftId: number) => {
        if (window.confirm('Are you sure you want to delete this shift?')) {
            try {
                await axios.delete(`http://localhost:8080/shift/${shiftId}`);
                const updatedShifts = shifts.filter((shift) => shift.id !== shiftId);
                setShifts(updatedShifts);
            } catch (error) {
                console.error('Error deleting shift: ', error);
            }
        }
    };



    return (
        <div className={styles.calendarEditPage}>
            <div className={styles.userList}>
                {users.map(user => (
                    <div key={user.id} className={styles.userItem}>
                        <h3>{`${user.firstname} ${user.lastname}`}</h3>
                    </div>
                ))}
            </div>

            <div className={styles.calendarGrid}>
                <div className={styles.headerRow}>
                    {weekDays.map(day => (
                        <div key={day} className={styles.headerCell}>{day}</div>
                    ))}
                </div>
                {users.map(user => (
                    <div key={user.id} className={styles.userRow}>
                        {weekDays.map(day => (
                            <div key={day} className={styles.shiftCell}>
                                {groupedShifts[user.id] && groupedShifts[user.id][day] && groupedShifts[user.id][day].map((shift, index) => (
                                    <div key={index}>

                                        {shift.text} (ID: {shift.shiftid})
                                        {/* Weitere Interaktionen wie Bearbeiten und Löschen können hier hinzugefügt werden */}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className={styles.assignShift}>
                <h2>Schicht zuweisen</h2>
                <label>Mitarbeiter auswählen:</label>
                <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                    <option value="">Bitte auswählen</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {`${user.firstname} ${user.lastname}`}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Shift ID"
                    value={newShiftId}
                    onChange={(e) => setNewShiftId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Text"
                    value={newShiftText}
                    onChange={(e) => setNewShiftText(e.target.value)}
                />
                <input
                    type="date"
                    value={newShiftDate}
                    onChange={(e) => setNewShiftDate(e.target.value)}
                />
                <button onClick={handleAssignShift}>Schicht zuweisen</button>
            </div>
        </div>
    );


};

export default CalendarEditPage;

