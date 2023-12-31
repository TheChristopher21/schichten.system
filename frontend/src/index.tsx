import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ShiftDetails from "./ShiftDetails";
import Register from "./Register";
import Login from "./Login";
import Header from "./components/Header"
import Start from "./Start";
import CalendarEditPage from "./CalendarEditPage";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <>
    <Header />
    <BrowserRouter>
      <Routes>
          <Route index element={<App />} />
          <Route path="/shift/:id" element={<ShiftDetails />} />
          <Route path="Login" element={<Login />} />
          <Route path="Register" element={<Register />} />
          <Route path="Start" element={<Start />} />
          <Route path="CalendarEditPage" element={<CalendarEditPage />} />

          <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </>
);
