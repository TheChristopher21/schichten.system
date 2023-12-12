import { createContext } from 'react';

interface state {
    popupState: {
        display: string,
        text: string
    },
    setPopupState: any
}

let obj: state = {
    popupState: {
        display: "none",
        text: ""
    },
    setPopupState: null
};

export const PopupContext = createContext(obj);