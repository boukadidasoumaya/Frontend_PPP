import NavBar from './Components/NavBar/NavBar';
import  Index from './chartsview/Index.js';
import { BrowserRouter as Router , Routes,Route} from 'react-router-dom';
import './App.css';
import Home from "./Components/Home/Home";
import Tables from './Components/Tables/Tables';
import "./assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-dashboard-react.scss";
function App() {
  return (
    <>
    <Router>
      <NavBar ></NavBar>
      <Routes>
        <Route path='/' exact element={<Home />} ></Route>
      </Routes>
      
      <Routes>
        <Route path='/tables' exact element={<Tables />} ></Route>
      </Routes>
      <Routes>
        <Route path='/charts' exact element={<Index />} ></Route>
      </Routes>
      </Router>
    </>
  );
}
export default App;
