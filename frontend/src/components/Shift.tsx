import { useContext } from "react";
import { PopupContext } from "../PopupContext";

enum ShiftType {
    BF = "Bankett-Früh",
    BM = "Bankett-Mittag",
    BA = "Bankett-Abend"
}

function Shift(props: any) {
    let start = new Date(props.start)
    let end = new Date(props.end)

    let { setPopupState } = useContext(PopupContext)

    function click() {
        setPopupState({
            display: "inline-block",
            text: "Hallo!"
        })
    }

    return (
        <div onClick={click} className="shift">{props.type} #{props.id} <br/><span className="shift-info">{start.getDate()}.{start.getMonth()}, {format_date(start)}-{format_date(end)} Uhr</span></div>
    )
}

function format_date(date: Date) {
    return `${date.getHours()}`.padStart(2, '0') + ":" + `${date.getMinutes()}`.padStart(2, '0')
}

export {
    ShiftType,
    Shift
}

