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
            if (response.data && response.data.token) {
                // Vor dem Speichern des neuen API-Schlüssels den vorhandenen entfernen
                localStorage.removeItem('apikey');
                // Speichern Sie den neuen API-Schlüssel im Local Storage
                localStorage.setItem('apikey', response.data.token);
                // Navigieren Sie zur nächsten Seite
                navigate('/CalendarViewPage');
            } else {
                setStatusMessage("Login fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldeinformationen.");
            }
        } catch (error) {
            console.error('Login Fehler', error);
            setStatusMessage("Fehler beim Einloggen. Bitte versuchen Sie es später erneut.");
        }
    };



console.log(localStorage)

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
