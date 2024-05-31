import React from "react";

import Header from "../../Components/Header/Header";
import Sidebar from "../../Components/Sidebar/Sidebar";
import NavBar from "../../Components/NavBar/NavBar";
import Scheduler from "../../Components/Scheduler/Scheduler";
import SelectOptions from "../../Components/SelectOptions/SelectOptions";
import EditorCustomField from "../../Components/Scheduler/EditorTemplate";

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
        <Scheduler />
        {/* <EditorCustomField /> */}
      </div>
    </>
  );
};

export default TimeTable;
