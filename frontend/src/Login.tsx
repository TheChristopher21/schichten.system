import React, { useState, ChangeEvent, FormEvent } from "react";
import styles from './css/Login.module.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [statusMessage, setStatusMessage] = useState("");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/user/login", formData);
            // Stellen Sie sicher, dass Sie auf den API-Key in der Struktur der Antwort korrekt zugreifen.
            // Es wird angenommen, dass der API-Key unter response.data.token verfügbar ist.
            // Überprüfen Sie die tatsächliche Struktur der Antwort Ihres Servers.
            if (response.data && response.data.token) {
                localStorage.setItem('apikey', response.data.token);
                // Annahme: Die Navigation zur Startseite erfolgt mit '/start' und nicht '/Start'.
                // Passen Sie den Pfad entsprechend Ihrer Routing-Konfiguration an.
                navigate('/CalendarViewPage');
            } else {
                // Fall, wenn keine Token in der Antwort sind (z.B. falsche Anmeldeinformationen)
                setStatusMessage("Login fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldeinformationen.");
            }
        } catch (error) {
            console.error('Login Fehler', error);
            setStatusMessage("Fehler beim Einloggen. Bitte versuchen Sie es später erneut.");
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginNavbar}>
                <a href="/">Home</a> {/* Hier sollte der Pfad angepasst werden */}
                <a href="/news">Neuigkeiten</a> {/* Angenommen, es gibt eine Route '/news' */}
                <a href="/login">Login</a> {/* Annahme: Pfadkorrektur */}
            </div>
            <div className={styles.loginBody}>
                <form onSubmit={handleSubmit} className={styles.formLogin}>
                    <h1 className={styles.loginTitle}>LogIn</h1>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Benutzername"
                            autoComplete="off"
                            value={formData.username}
                            onChange={handleInputChange}
                        /><br/>
                    </div>
                    <div className={styles.inputContainer}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Passwort"
                            autoComplete="off"
                            value={formData.password}
                            onChange={handleInputChange}
                        /><br/>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.loginButton}>
                            LogIn
                        </button>
                        <br/>
                    </div>
                </form>
                <div className={styles.signup}>
                    <button onClick={() => navigate("/register")}>
                        Noch kein Account? Jetzt Registrieren
                    </button>
                    <br/>
                </div>
                {statusMessage && (
                    <div className={styles.statusMessage}>
                        {statusMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
