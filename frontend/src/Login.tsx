import React, { useState, ChangeEvent, FormEvent } from "react";
import './css/Login.css';
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
        <div>
            <div className="login-navbar">
                <a href="App.tsx">Home</a>
                <a href="">Neuigkeiten</a>
                <a href="Login.tsx">Login</a>
            </div>
            <div className="login-body">
                <form onSubmit={handleSubmit} className="formlogin">
                    <h1 className="login-title">LogIn</h1>
                    <div className="login-input-container">
                        <input
                            type="text" // Ändere den Typ von "email" auf "text"
                            id="username" // Ändere die ID auf "username" für den Benutzernamen
                            placeholder="Benutzername" // Ändere den Platzhaltertext
                            autoComplete="off"
                            onChange={handleInputChange}
                        /><br></br>
                    </div>
                    <div className="login-input-container">
                        <input
                            type="password"
                            id="password"
                            placeholder="Passwort"
                            autoComplete="off"
                            onChange={handleInputChange}
                        /><br></br>
                    </div>
                    <div className="login-button-container">
                        <button type="submit" className="login-button">
                            LogIn
                        </button><br></br>
                    </div>
                </form>
                <div className="login-signup">
                    <button onClick={() => { navigate("/Register") }}>
                        Noch kein Account? Jetzt Registrieren
                    </button><br></br>
                </div>
                {statusMessage && (
                    <div className="status-message">
                        {statusMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
