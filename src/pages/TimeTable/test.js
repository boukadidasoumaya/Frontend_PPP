import React from "react";

import TimeTableTest from "../../Components/TableTime/TimeTableTest";
import Header from "../../Components/Header/Header";
import Sidebar from "../../Components/Sidebar/Sidebar";
import NavBar from "../../Components/NavBar/NavBar";

const TimeTable = (props) => {
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

      <div className="main-content">
        <NavBar {...props} />
        <Header />
        <TimeTableTest />
      </div>
    </>
  );
};

export default TimeTable;
