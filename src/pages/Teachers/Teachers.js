import React from "react";

import Header from "../../Components/Header/Header";
import Sidebar from "../../Components/Sidebar/Sidebar";
import NavBar from "../../Components/NavBar/NavBar";
// core components

import TableTeachers from "../../Components/TableTeachers/TableTeacher";

const Teachers = (props) => {
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

        <TableTeachers />
      </div>
    </>
  );
};

export default Teachers;
