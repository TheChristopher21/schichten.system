import React, { useState, ChangeEvent, FormEvent } from "react";
import styles from './css/Login.module.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [statusMessage, setStatusMessage] = useState("");
    const [apiKey, setApiKey] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/user/login", formData);
            if (response.data) {
                // Vor dem Speichern des neuen API-Schlüssels den vorhandenen entfernen
                localStorage.removeItem('apikey');
                localStorage.removeItem('loginTime'); // Remove previous login time
                // Speichern Sie den neuen API-Schlüssel im Local Storage
                localStorage.setItem('apikey', response.data);
                localStorage.setItem('loginTime', Date.now().toString()); // Store login time
                // Setzen Sie den API-Schlüssel im State
                setApiKey(response.data);
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

    // Einrichten des API-Clients mit dem aktuellen API-Schlüssel
    const api = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    });

    api.interceptors.request.use(config => {
        if (apiKey) {
            config.headers.Authorization = `Bearer ${apiKey}`;
        }
        return config;
    });

    console.log(apiKey)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginNavbar}>
                <a href="/">Home</a>
                <a href="/news">Neuigkeiten</a>
                <a href="/login">Login</a>
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
