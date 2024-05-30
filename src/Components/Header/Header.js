
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import './Header.css'
import React, { useEffect, useState } from 'react';
const Header = () => {

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalClasses, settotalClasses] = useState(0);
  const [dataav, setDataav] = useState({ totalAbsences: 0, totalAttendances: 0, averageAbsencesPercentage: 0 });

  useEffect(() => {
    const fetchAverageAbsences = async () => {
      try {
          const response = await fetch('http://localhost:3000/api/attendance/calculateAverageAbsences');
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data3 = await response.json();
          setDataav(data3);
          console.log(data3);
      } catch (error) {
        console.error(error.message);
      }
  };

  fetchAverageAbsences();
    // Function to fetch student data and calculate total students
    const fetchTotalStudents = async () => {
      try {
        const response = await fetch('/students/count'); // Assuming your React app is served from the same host as your Express server

        if (!response.ok) {
          throw new Error('Failed to fetch student data');
        }

        const data = await response.json();
console.log(data);
        // Calculate the total number of students from the fetched data
        const total = data.totalStudent;
        
        setTotalStudents(total);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    }; // Empty dependency array means this effect runs once when the component mounts
    const fetchTotalClasses = async () => {
      try {
        const response = await fetch('/classes/count'); // Assuming your React app is served from the same host as your Express server
        const data2 = await response.json()
        const total2=data2.totalClasses;
        console.log(total2);
settotalClasses(total2);
        if (!response.ok) {
          throw new Error('Failed to fetch classt data');
        }

        const data = await response.json();
console.log(data);
        // Calculate the total number of students from the fetched data
        const total = data.totalStudent;
        
        setTotalStudents(total);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    }; // Empty dependency array means this effect runs once when the component mounts

    const fetchTotalTeachers = async () => {
      try {
        const response = await fetch('/teachers/count'); // Assuming your React app is served from the same host as your Express server
console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch student data');
        }

        const data = await response.json();
console.log(data);
        // Calculate the total number of students from the fetched data
        const total = data.totalProfessors
        
        setTotalTeachers(total);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    }; // Empty dependency array means this effect runs once when the component mounts
    fetchTotalClasses();
    fetchTotalTeachers();
    // Call the function when component mounts
    fetchTotalStudents();
    console.log(totalStudents);
  }, []);
  return (
    <>
      <div className="header  pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Students
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                        {totalStudents}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                    
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Teachers
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{totalTeachers}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                    
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Classes
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{totalClasses}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                    
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                         Absence Moyenne
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{dataav.averageAbsencesPercentage}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-percent" />
                        </div>
                      </Col>
                    </Row>
                  
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
