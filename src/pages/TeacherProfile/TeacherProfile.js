import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import Sidebar from "../../Components/Sidebar/Sidebar";
import NavBar from "../../Components/NavBar/NavBar";
import Header from "../../Components/Header/Header";
import TableTeachers from "../../Components/TableTeachers/TableTeacher";
import { Tab } from "react-bootstrap";
import TableAbsence from "../../Components/TableAbsence/TableAbsence";
import Absence_Calender from "../../Components/Charts/Absence_Calendar";
import { useLocation } from "react-router-dom";
import TeacherData from "../../Components/Charts/TeacherData";
import { useEffect, useState } from "react";
import axios from "axios";

// core components

const TeacherProfile = (props) => {
  const token = sessionStorage.getItem('jwtToken');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const location = useLocation(); // Get the current location object
  const selectedteacher = location.state?.selectedteacher; // Access the selectedteacher object from the state
  console.log("Selected teacher from profile:", selectedteacher);
  
  const teacherId = selectedteacher?._id;
  console.log("Teacher ID:", teacherId);
  
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    if (teacherId) {
      axios
        .get(`http://localhost:5000/teachers/teacher/${teacherId}`,config)
        .then((response) => {
          console.log("Response from API:", response.data.data);
          setTeacher(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching teacher:", error);
        });
    } else {
      console.error("No teacher ID provided.");
    }
  }, [teacherId]);

  if (!selectedteacher) {
    return <div>No teacher selected</div>;
  }

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
                          src={require("../../assets/img/theme/avatar.png")}
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
                      {teacher?.FirstName} {teacher?.LastName}
                      <span className="font-weight-light"></span>
                    </h3>
                    <div className="h5 font-weight-300">
                      {teacher?.Major} {teacher?.Year}
                    </div>
                    <div className="h5 font-weight-300">
                      CIN : {teacher?.CIN}
                    </div>
                    <div className="h5 font-weight-300">{teacher?.Email}</div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1" xl="8">
              <TeacherData teacherId={teacherId} />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default TeacherProfile;
