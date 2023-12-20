import React, { useState } from "react";
import './css/Register.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Registrieren() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        benutzername: "",
        vorname: "",
        nachname: "",
        email: "",
        passwort: ""
    });
    const [statusMessage, setStatusMessage] = useState("");

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
        <div>
            <div className="register-navbar">
                <a href="App.tsx">Home</a>
                <a href="">Neuigkeiten</a>
                <a href="Login.tsx">Login</a>
            </div>
            <div className="register-body">
                <form onSubmit={handleSubmit}>
                    <h1 className="register-title">Account Erstellen</h1>

                    <div className="register-input-container">
                        <input
                            type="text"
                            id="benutzername"
                            placeholder="Benutzername"
                            autoComplete="off"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="register-input-container">
                        <input
                            type="text"
                            id="vorname"
                            placeholder="Vorname"
                            autoComplete="off"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="register-input-container">
                        <input
                            type="text"
                            id="nachname"
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
                            id="passwort" // Ändere die ID auf "passwort"
                            placeholder="Passwort"
                            autoComplete="off"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="register-button-container">
                        <button  type="submit" className="register-button" name="submit">
                            Erstellen
                        </button>
                        <br></br>
                    </div>

                    {statusMessage && (
                        <div className="status-message">
                            {statusMessage}
                        </div>
                    )}

                    <button onClick={() => { navigate("/Login") }} className="register-login-button">
                        Schon ein Account erstellt? Jetzt Einloggen!
                    </button>
                </form>
            </div>
        </div>
    );
}
export default Registrieren;