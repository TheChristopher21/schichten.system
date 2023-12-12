import {useParams} from "react-router-dom";
import Header from "./components/Header";

function ShiftDetails() {
    const params = useParams()

    return (
        <div>
            <Header />
            Shift Details <br /> id: {params.id}
        </div>
    )
}

export default ShiftDetails