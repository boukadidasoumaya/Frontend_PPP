import React from 'react';

import Header from "../../Components/Header/Header";
import Sidebar from "../../Components/Sidebar/Sidebar";
import NavBar from "../../Components/NavBar/NavBar";
// core components

import TableStudents from '../../Components/TableStudents/TableStudents';

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
       <TableStudents/>
       
  
      </div>  
      </>
  );


};

export default Students;
