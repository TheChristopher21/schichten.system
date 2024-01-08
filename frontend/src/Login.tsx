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

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:8080/user/login", formData);
            console.log(response.data);
            navigate('/App'); // Navigiere zur App-Seite nach erfolgreicher Anmeldung
        } catch (error) {
            console.error(error);
            setStatusMessage("Fehler beim Einloggen!"); // Zeige eine Fehlermeldung an, wenn der Login fehlschlägt
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await handleLogin();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginNavbar}>
                <a href="App.tsx">Home</a>
                <a href="">Neuigkeiten</a>
                <a href="Login.tsx">Login</a>
            </div>
            <div className={styles.loginBody}>
                <form onSubmit={handleSubmit} className={styles.formLogin}>
                    <h1 className={styles.loginTitle}>LogIn</h1>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            id="username"
                            placeholder="Benutzername"
                            autoComplete="off"
                            onChange={handleInputChange}
                        /><br />
                    </div>
                    <div className={styles.inputContainer}>
                        <input
                            type="password"
                            id="password"
                            placeholder="Passwort"
                            autoComplete="off"
                            onChange={handleInputChange}
                        /><br />
                    </div>
                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.loginButton}>
                            LogIn
                        </button><br />
                    </div>
                </form>
                <div className={styles.signup}>
                    <button onClick={() => navigate("/Register")}>
                        Noch kein Account? Jetzt Registrieren
                    </button><br />
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
