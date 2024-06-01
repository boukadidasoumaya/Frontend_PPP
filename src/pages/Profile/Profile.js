import { Card, CardHeader, CardBody, Container, Row, Col } from "reactstrap";
import Sidebar from "../../Components/Sidebar/Sidebar";
import NavBar from "../../Components/NavBar/NavBar";
import Header from "../../Components/Header/Header";
import TableAbsence from "../../Components/TableAbsence/TableAbsence";
import Absence_Calender from "../../Components/Charts/Absence_Calendar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

  // core components
  
  const Profile = (props) => {
const token= sessionStorage.getItem('jwtToken');
    const location = useLocation(); // Get the current location object
    const selectedStudent = location.state?.selectedStudent; // Access the selectedStudent object from the state
    console.log("selected student from profile",selectedStudent);
    //concerning the info of profile take the id and do anther axios here so that we can recupere the info of the student
    const studentId = selectedStudent._id;
    const [student, setStudent] = useState([]);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    useEffect(() => {
      axios.get(`http://localhost:5000/students/${studentId}`,config)
        .then(response => {
          setStudent(response.data.data);
          
        })
        .catch(error => {
          console.error('Error fetching majors:', error);
        });
    },[]);
    console.log("student from axios",student);
    function calculateAge(birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
      }
      return age;
  }

  const age = calculateAge(student.Birthday);
  console.log("Age:", age); // Output the calculated age
  const studentType =
    student.Year <= 2 ? "Cycle Prepatoire" : "Cycle Ingenieur";

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
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4"></CardHeader>
                <CardBody className="pt-0 pt-md-4">
                  <Row>
                    <div className="col">
                      <div className="card-profile-stats d-flex justify-content-center mt-md-5"></div>
                    </div>
                  </Row>
                  <div className="text-center ">
                    <h3>
                      {student.FirstName} {student.LastName}
                      <span className="font-weight-light"> {age}</span>
                    </h3>
                    <div className="h5 font-weight-300">
                      {student.Major} {student.Year}
                    </div>
                    <div className="h5 font-weight-300">
                      CIN : {student.CIN}
                    </div>
                    <div className="h5 font-weight-300">{studentType}</div>

                    <div className="h5 font-weight-300">{student.Email}</div>

                    <div>
                      <Absence_Calender />
                    </div>
                    <div></div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1" xl="8">
              <TableAbsence id={studentId}/>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Profile;
