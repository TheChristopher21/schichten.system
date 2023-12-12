import { useState, useContext } from "react"
import { PopupContext } from "../PopupContext";

function Popup(){
    const { popupState, setPopupState } = useContext(PopupContext);

    return(
        <div className="popup" style={{ display: popupState.display }}>
            <div className="popup-content">
                {popupState.text}
                <button onClick={() => {setPopupState({ display: "none", text: ""})}}>close</button>
            </div>
        </div>
    )
}

export {Popup}
