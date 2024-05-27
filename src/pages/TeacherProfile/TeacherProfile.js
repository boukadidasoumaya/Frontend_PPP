import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col,
  } from "reactstrap";
import Sidebar from "../../Components/Sidebar/Sidebar";
import NavBar from "../../Components/NavBar/NavBar";
import Header from "../../Components/Header/Header";
import TableAbsence from "../../Components/TableAbsence/TableAbsence";
import Absence_Calender from "../../Components/Charts/Absence_Calendar";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';

  // core components
  
  const TeacherProfile = (props) => {
    const location = useLocation(); // Get the current location object
    const selectedTeacher = location.state?.selectedTeacher; // Access the selectedTeacher object from the state
    console.log("selected Teacher from profile",selectedTeacher);
    //concerning the info of profile take the id and do anther axios here so that we can recupere the info of the Teacher
    const TeacherId = selectedTeacher._id;
    const [Teacher, setTeacher] = useState([]);

    useEffect(() => {
      axios.get(`http://localhost:5000/Teachers/${TeacherId}`)
        .then(response => {
          setTeacher(response.data.data);
          
        })
        .catch(error => {
          console.error('Error fetching majors:', error);
        });
    },[]);
    console.log("Teacher from axios",Teacher);
//     function calculateAge(birthDate) {
//       const today = new Date();
//       const birth = new Date(birthDate);
//       let age = today.getFullYear() - birth.getFullYear();
//       const monthDiff = today.getMonth() - birth.getMonth();
//       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
//           age--;
//       }
//       return age;
//   }
  
//   const age = calculateAge(Teacher.Birthday);
//   console.log("Age:", age); // Output the calculated age
//   const TeacherType = Teacher.Year <= 2 ? "Cycle Prepatoire" : "Cycle Ingenieur";

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
             <Container className="mt--5" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={require("../../assets/img/theme/team-4-800x800.jpg")}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                    </div>
                  </div>
                </Row>
                <div className="text-center ">
                  {/* <h3>
                    {Teacher.FirstName} {Teacher.LastName}
                    <span className="font-weight-light">  {age}</span>
                  </h3> */}
                  <div className="h5 font-weight-300">
                   
                    {Teacher.Major} {Teacher.Year} 
                  </div>
                  <div className="h5 font-weight-300">
                    CIN : {Teacher.CIN}
                  </div>
                  {/* <div className="h5 font-weight-300">
                    {TeacherType}
                  </div> */}
                  
                  <div className="h5 font-weight-300">
                    {Teacher.Email}
                  </div>

                  <div>
                    <Absence_Calender />
                  </div>
                  <div>

                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <TableAbsence />
          </Col>
        </Row>
      </Container>

           </div> 
       
      </>
    );
  };
  
  export default TeacherProfile;
  