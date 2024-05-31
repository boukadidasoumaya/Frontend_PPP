import NavBar from "./Components/NavBar/NavBar";
import Index from "./pages/chartsPage/Index.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Students from './pages/Students/Students';
import Teachers from './pages/Teachers/Teachers';
// import TimeTable from './pages/TimeTable/TimeTable';


import LoginPage from "./pages/loginPage/LoginPage.js";
import "./assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-dashboard-react.scss";
import Profile from './pages/Profile/Profile.js';
import Courses from './pages/Courses/Courses.js';
import TimeTable from './pages/TimeTable/TimeTable.js';
import Verifing from './Components/login/Verification.js';
import TeacherProfile from "./pages/TeacherProfile/TeacherProfile.js";
import Unauthorized from './pages/Unauthorized.js';
function App() {
  return (
    <>
    <Router>
      
      <Routes>
        <Route path='/' exact element={<Home />} ></Route>
        <Route path='/students' exact element={<Students />} ></Route>
        <Route path='/teachers' exact element={<Teachers />} ></Route>
        <Route path='/timetable' exact element={<TimeTable />} ></Route>
        <Route path='/charts' exact element={<Index />} ></Route>
        <Route path='profile' exact element={<Profile />} ></Route>
        <Route path = 'TeacherProfile' exact element={<TeacherProfile />} ></Route>
        <Route path='courses' exact element={<Courses />} ></Route>
        <Route path='/login' exact element={<LoginPage />} ></Route>
        <Route path='/forgot' exact element={<LoginPage componentToRender='forgot' />} ></Route>
        <Route path="/forgot/passwordReset/verif" element={<LoginPage componentToRender='verification' />} />
        <Route path="/unauthorized" exact element={<LoginPage />} />
        <Route path='profile' exact element={<Profile />} ></Route>
        <Route path='courses' exact element={<Courses />} ></Route>
      </Routes>
      </Router>
    </>
  );
}
export default App;
