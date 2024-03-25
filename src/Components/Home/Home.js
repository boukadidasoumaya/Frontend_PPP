import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import NavBar from '../NavBar/NavBar';
import routes from "../../routes";

import { useLocation, Route, Routes, Navigate  } from "react-router-dom";

const Home = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      return (
        <Route path={prop.layout + prop.path} element={prop.component} key={key} exact />
      );
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/",
          imgSrc: require("../../assets/img/brand/insatlogo.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <NavBar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </>
  );
}

export default Home;
