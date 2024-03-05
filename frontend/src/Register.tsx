import React, {useEffect, useState} from "react";
import styles from './css/Register.module.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Registrieren() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: ""
    });
    const [statusMessage, setStatusMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSpecialUser, setIsSpecialUser] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('userToken');
        const userRole = localStorage.getItem('userRole'); // Angenommen, die Benutzerrolle wird bei der Anmeldung gespeichert

        setIsLoggedIn(!!token);
        setIsSpecialUser(userRole === 'special'); // 'special' ist ein Platzhalter für die Rolle des speziellen Benutzers
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setIsSpecialUser(false);
        navigate('/'); // Zurück zur Startseite navigieren
    };
    const handleRegistration = async () => {
        try {
            const response = await axios.post("http://localhost:8080/user/register", formData);
            console.log(response.data);
            setStatusMessage("Benutzer erfolgreich registriert!");
            navigate("/Login");
        } catch (error) {
            console.error(error);
            setStatusMessage("Fehler beim Registrieren des Benutzers!");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await handleRegistration();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerNavbar}>
                <a href="App.tsx">Home</a>
                {isSpecialUser && <a href="CalendarEditPage">EditPage</a>}
                {isSpecialUser && <a href="BewerbungsKalenderPage">Ausstehende Bewerbungen</a>}
                {!isLoggedIn && <a href="Login">Login</a>}
                {!isLoggedIn && <a href="Register">Registrieren</a>}
                {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
                {isLoggedIn && <a href="CalendarViewPage">Mitarbeiter Kalender</a>}
            </div>
            <div className={styles.registerBody}>
                <form onSubmit={handleSubmit}>
                    <h1 className={styles.registerTitle}>Account Erstellen</h1>

                    <div className="register-input-container">
                        <input
                            type="text"
                            id="username"
                            placeholder="Benutzername"
                            autoComplete="off"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="register-input-container">
                        <input
                            type="text"
                            id="firstname"
                            placeholder="Vorname"
                            autoComplete="off"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="register-input-container">
                        <input
                            type="text"
                            id="lastname"
                            placeholder="Nachname"
                            autoComplete="off"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="register-input-container">
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            autoComplete="off"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="register-input-container">
                        <input
                            type="password"
                            id="password" // Ändere die ID auf "passwort"
                            placeholder="Passwort"
                            autoComplete="off"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="register-button-container">
                        <button type="submit" className="register-button" name="submit">
                            Erstellen
                        </button>
                        <br></br>
                    </div>

                    {statusMessage && (
                        <div className="status-message">
                            {statusMessage}
                        </div>
                    )}

                    <button onClick={() => {
                        navigate("/Login")
                    }} className="register-login-button">
                        Schon ein Account erstellt? Jetzt Einloggen!
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Registrieren;