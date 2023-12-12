import React, { useState } from 'react';
import { Shift, ShiftType } from './components/Shift';
import { PopupContext } from './PopupContext';

function CalendarEditPage() {
    const [currentCalendarWeek, setCurrentWeek] = useState(getCurrentCalendarWeek());

    function getCurrentCalendarWeek() {
        const now = new Date();
        const onejan = new Date(now.getFullYear(), 0, 1);
        let week = Math.ceil(((now.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
        return week;
    }

    function next() {
        setCurrentWeek((prevWeek) => (prevWeek >= 50 ? 1 : prevWeek + 1));
    }

    function previous() {
        setCurrentWeek((prevWeek) => (prevWeek <= 1 ? 50 : prevWeek - 1));
    }

    return (
        <div>
            <h1>Edit Calendar</h1>
            <table className="table1" id="calendar">
                <thead>
                <tr>
                    <th className="shift-extra">
                        <button id="previous" onClick={previous}>&#706;</button>
                    </th>
                    <th>Kalenderwoche {currentCalendarWeek}</th>
                    <th>Kalenderwoche {currentCalendarWeek + 1}</th>
                    <th>Kalenderwoche {currentCalendarWeek + 2}</th>
                    <th className="shift-extra">
                        <button id="next" onClick={next}>&#707;</button>
                    </th>
                </tr>
                </thead>
                <tbody>
                {/* Your editable calendar cells go here */}
                {/* Example: */}
                <tr>
                    <th className="shift-extra">Montag</th>
                    <th><Shift type={ShiftType.BA} id="2239" start={Date.now()} end={Date.now() + 36200200} /></th>
                    {/* Add editable cells here */}
                    {/* You can use form inputs, buttons, or any other interactive elements for editing */}
                </tr>
                {/* More calendar rows */}
                </tbody>
            </table>
        </div>
    );
}

export default CalendarEditPage;
