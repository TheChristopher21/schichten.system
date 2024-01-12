import React, { useState, ChangeEvent, FormEvent } from "react";
import styles from './css/Login.module.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [statusMessage, setStatusMessage] = useState("");
    const [username, setUsername] = useState(''); // Zustand für Benutzername
    const [password, setPassword] = useState(''); // Zustand für Passwort

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:8080/user/login", formData);
            console.log(response.data);
            navigate('/CalendarViewPage'); // Navigiere zur App-Seite nach erfolgreicher Anmeldung
        } catch (error) {
            console.error(error);
            setStatusMessage("Fehler beim Einloggen!"); // Zeige eine Fehlermeldung an, wenn der Login fehlschlägt
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/user/login", formData);
            localStorage.setItem('userToken', response.data.token); // Speichern des erhaltenen Tokens
            navigate('/CalendarViewPage'); // Navigiere zur App-Seite nach erfolgreicher Anmeldung
        } catch (error) {
            console.error('Login Fehler', error);
            setStatusMessage("Fehler beim Einloggen!"); // Zeige eine Fehlermeldung an, wenn der Login fehlschlägt
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginNavbar}>
                <a href="App.tsx">Home</a>
                <a href="">Neuigkeiten</a>
                <a href="Login">Login</a>
            </div>
            <div className={styles.loginBody}>
                <form onSubmit={handleSubmit} className={styles.formLogin}>
                    <h1 className={styles.loginTitle}>LogIn</h1>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            name="username" // geändert von id zu name
                            placeholder="Benutzername"
                            autoComplete="off"
                            value={formData.username}
                            onChange={handleInputChange}
                        /><br/>
                    </div>
                    <div className={styles.inputContainer}>
                        <input
                            type="password"
                            name="password" // geändert von id zu name
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
                    <button onClick={() => navigate("/Register")}>
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
