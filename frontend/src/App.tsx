import React, { useState, useEffect } from 'react';
import './css/App.css';
import { useNavigate } from 'react-router-dom';
import { Shift, ShiftType } from './components/Shift';

function getCurrentCalendarWeek() {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    return Math.ceil(((now.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
}

function next(setCurrentWeek: React.Dispatch<React.SetStateAction<number>>) {
    setCurrentWeek((prevWeek) => (prevWeek >= 50 ? 1 : prevWeek + 1));
}

function previous(setCurrentWeek: React.Dispatch<React.SetStateAction<number>>) {
    setCurrentWeek((prevWeek) => (prevWeek <= 1 ? 50 : prevWeek - 1));
}

function App() {
    const [name] = useState('');
    const [currentCalendarWeek, setCurrentWeek] = useState(getCurrentCalendarWeek());
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [redirectAfterLogin, setRedirectAfterLogin] = useState(false); // Neue Zustandsvariable für den Redirect
    const navigate = useNavigate(); // Erhalte die navigate-Funktion aus useNavigate

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            setRedirectAfterLogin(true); // Setze den Zustand für den Redirect
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        // Hier könntest du die Logik für den Logout implementieren
        localStorage.removeItem('token'); // Entferne das Token aus dem localStorage oder von der Authentifizierungsspeicherstelle

        // Navigiere zur Login-Seite nach dem Ausloggen
        navigate('/Login');
    };
    useEffect(() => {
        if (redirectAfterLogin) {
            navigate('/App'); // Navigiere zur Startseite, wenn der Zustand für Redirect true ist
        }
    }, [redirectAfterLogin, navigate]);


    return (
        <div>
            <div className="login-navbar">
                <a href="App.tsx">Kalender</a>
                <a href="Start.tsx">Home</a>
                <a href="">Neuigkeiten</a>
                <a href="Login.tsx">Login</a>
                <button onClick={handleLogout}>Logout</button>
            </div>



            <div className="App">

                            <p>Das ist das Popup-Inhalt.</p>
                        </div>
                    <div className="App">
                    <h1 className="welcome">Hey, {name}!</h1>
            <table className="table1" id="calendar">
                <thead>
                <tr>
                    <th className="shift-extra">
                        <button id="previous" onClick={() => previous(setCurrentWeek)}>
                            &#706;
                        </button>
                    </th>
                    <th>Kalenderwoche {currentCalendarWeek}</th>
                    <th>Kalenderwoche {currentCalendarWeek + 1}</th>
                    <th>Kalenderwoche {currentCalendarWeek + 2}</th>
                    <th className="shift-extra">
                        <button id="next" onClick={() => next(setCurrentWeek)}>
                            &#707;
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th className="shift-extra">Montag</th>
                    <th></th>
                    <th><Shift type={ShiftType.BA} id="2239" start={Date.now()} end={Date.now()+36200200} /></th>
                    <th><Shift type={ShiftType.BF} id="1929" start={Date.now()} end={Date.now()+3670000} /></th>
                </tr>
                <tr>
                    <th  className="shift-extra">Dienstag</th>
                    <th><Shift type={ShiftType.BM} id="2829" start={Date.now()} end={Date.now()+31602000}/></th>
                    <th></th>
                    <th><Shift type={ShiftType.BA} id="1929" start={Date.now()} end={Date.now()+34606000}/></th>
                </tr>
                <tr>
                    <th className="shift-extra">Mittwoch</th>
                    <th><Shift type={ShiftType.BF} id="2829" start={Date.now()} end={Date.now()+36240000}/></th>
                    <th><Shift type={ShiftType.BA} id="2239" start={Date.now()} end={Date.now()+36101000}/></th>
                    <th></th>
                </tr>
                <tr>
                    <th className="shift-extra">Donnerstag</th>
                    <th></th>
                    <th><Shift type={ShiftType.BM} id="2239" start={Date.now()} end={Date.now()+36600100}/></th>
                    <th><Shift type={ShiftType.BF} id="1929" start={Date.now()} end={Date.now()+3606000}/></th>
                </tr>
                <tr>
                    <th className="shift-extra">Freitag</th>
                    <th><Shift type={ShiftType.BM} id="2829" start={Date.now()} end={Date.now()+36010900}/></th>
                    <th></th>
                    <th><Shift type={ShiftType.BF} id="1929" start={Date.now()} end={Date.now()+36106000}/></th>
                </tr>
                <tr>
                    <th className="shift-extra">Samstag</th>
                    <th><Shift type={ShiftType.BF} id="2829" start={Date.now()} end={Date.now()+36031000}/></th>
                    <th><Shift type={ShiftType.BA} id="2239" start={Date.now()} end={Date.now()+3606000}/></th>
                    <th><Shift type={ShiftType.BA} id="1929" start={Date.now()} end={Date.now()+3602000}/></th>
                </tr>
                <tr>
                    <th className="shift-extra">Sonntag</th>
                    <th></th>
                    <th><Shift type={ShiftType.BF} id="2239" start={Date.now()} end={Date.now()+32601000}/></th>
                    <th><Shift type={ShiftType.BM} id="1929" start={Date.now()} end={Date.now()+38600300}/></th>
                </tr>
            </tbody>
            </table>
        </div>
                    </div>

);
}

export default App;
