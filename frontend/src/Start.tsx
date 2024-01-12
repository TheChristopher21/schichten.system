import React from 'react';
import styles from "./css/Register.module.css";


function Start() {
    return (
        <div className="App">
            <div className="content">
                <div className={styles.registerNavbar}>
                    <a href="App.tsx">Home</a>
                    <a href="CalendarEditPage">EditPage</a>
                    <a href="BewerbungsKalenderPage">Ausstehende Bewerbungen</a>
                    <a href="Login">Login</a>
                    <a href="Register">Registrieren</a>


                </div>
                <h1>Willkommen im SeedammPlaza!</h1>
            </div>
        </div>
    );
}

export default Start;
