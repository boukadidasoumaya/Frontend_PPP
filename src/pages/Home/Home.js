import React from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import NavBar from '../../Components/NavBar/NavBar';
import routes from "../../routes";

import { useLocation, Route, Routes, Navigate  } from "react-router-dom";
import Header from '../../Components/Header/Header';
import Index from '../../pages/chartsPage/Index';

const Home = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  

  return (
    <>
      <Sidebar
        {...props}
       
        logo={{
          innerLink: "/",
          imgSrc: require("../../assets/img/brand/insatlogo.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <NavBar {...props} />
     <Header />
     <Index />
      </div>
    </>
  );
}

export default Home;
