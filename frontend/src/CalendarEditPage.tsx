import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/CalendarEditPage.css';

interface Shift {
    id: number;
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [shiftsResponse, usersResponse] = await Promise.all([
                    axios.get<Shift[]>('http://localhost:8080/shift'),
                    axios.get<User[]>('http://localhost:8080/user/userdetails')
                ]);
                console.log(shiftsResponse);
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
            ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(day => {
                groupedShifts[user.id][day] = shifts.filter(shift => shift.userId === user.id && shift.date === day);
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
            id: 0,
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
        <div className="calendar-edit-page">
            <div className="calendar">
                <div className="user-list">
                    <div className="header-row">
                        <span></span> {/* Leerer Bereich für den Header */}
                        {/* Fügen Sie die Wochentage hinzu */}
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                            <span key={`header-${index}`}>{day}</span>
                        ))}
                    </div>
                    {/* Mappen der Benutzer */}
                    {users.map((user) => (
                        <div key={`user-${user.id}`} className="user-item">
                            <h3>{`${user.firstname} ${user.lastname}`}</h3>
                            <div className="user-shifts">
                                {/* Mappen der Wochentage außerhalb der Schleife für die Benutzer */}
                                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => {
                                    const userShifts = groupedShifts[user.id][day];
                                    return (
                                        <div key={`shift-${user.id}-${index}`} className="shift-item">
                                            {/* Überprüfen und Anzeigen der Schicht des Benutzers an diesem Wochentag */}
                                            {userShifts.length > 0 ? (
                                                userShifts.map((shift, shiftIndex) => (
                                                    <div key={`shift-${shiftIndex}`}>
                                                        <span>ID: {shift.shiftid}</span>
                                                        <input
                                                            type="text"
                                                            value={shift.text}
                                                            onChange={(e) => {
                                                                const newText = e.target.value;
                                                                handleEdit(shift.id, 'text', newText);
                                                            }}
                                                        />
                                                        <button onClick={() => handleSave(shift.id, shift.text)}>Speichern</button>
                                                        <button onClick={() => handleDelete(shift.id)}>Löschen</button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>
                                                    {/* Wenn keine Schicht vorhanden ist, zeige leere Felder an */}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="assign-shift">
                <h2>Schicht zuweisen</h2>
                <label>Mitarbeiter ID:</label>
                <input
                    type="text"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                />
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
