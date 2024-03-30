import NavBar from './Components/NavBar/NavBar';
import { BrowserRouter as Router , Routes,Route} from 'react-router-dom';
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/Home/Home";
import Students from './pages/Students/Students';
import Teachers from './pages/Teachers/Teachers';
import TimeTable from './pages/TimeTable/TimeTable';

import "./assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-dashboard-react.scss";
function App() {
  return (
    <>
    <Router>
      
      <Routes>
        <Route path='/' exact element={<Home />} ></Route>
        <Route path='/students' exact element={<Students />} ></Route>
        <Route path='/faculties' exact element={<Teachers />} ></Route>
        <Route path='/timetable' exact element={<TimeTable />} ></Route>
      </Routes>
     
      </Router>
    </>
  );
}
export default App;
