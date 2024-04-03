import React from 'react';

import Header from "../../Components/Header/Header";
import Sidebar from "../../Components/Sidebar/Sidebar";
import NavBar from "../../Components/NavBar/NavBar";
// core components

import TableCourses from '../../Components/TableCourses/TableCourses';
import RowTemplate from '../../Components/TableCourses/RowTemplate';
const Students = (props) => {
  
  return (
   <> 
   <Sidebar 
      {...props}
      logo={{
        innerLink: "/",
        imgSrc: require("../../assets/img/brand/insatlogo.png"),
        imgAlt: "...",}} />
    
       
      <div className="main-content">
      <NavBar {...props} />
        <Header />
       <TableCourses/>
      </div>  
      </>
  );


};

export default Students;
