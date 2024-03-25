
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./Components/Home/Home";
import Tables from './Components/Tables/Tables';
import "./assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-dashboard-react.scss";

function App() {
  const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
    },
    {
      path: "/tables",
      element: <Tables/>,
  }
  ]);

  return (
    <div className="App">
      
                <RouterProvider router={router}/>
            
    </div>
  );
}

export default App;
