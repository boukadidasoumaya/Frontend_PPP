import Linechart from '../../Components/Charts/Linechart.js';
import * as React from 'react';
//import { LineChart } from '@mui/x-charts/LineChart';
import { useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
import routes from "../../routes.js";
import { useEffect } from 'react';
import Barchart from '../../Components/Charts/Barchart.js';// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import Sidebar from '../../Components/Sidebar/Sidebar.js';
import Header from "../../Components/Header/Header.js";
import { colors } from '@mui/material';
import LinechartW from '../../Components/Charts/LinechartW.js';
import PieChart from '../../Components/Charts/PieChart.js';
const Index = (props) => {
  const [activeNav, setActiveNav] = useState("M");
  const [chartLineData, setChartLineData] = useState("dataM");

 
  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartLineData("data" + index);
  };
  const [pieData, setPieData] = useState([]);
const [totalTeachers, setTotalTeachers] = useState(0);
  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');

    const fetchTotalTeachers = async () => {
      const requestOptions = {
        method: 'GET', // Assuming you're fetching student data with a GET request
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          'Content-Type': 'application/json'
        }
      };
      
      try {
        const response = await fetch('/teachers/count', requestOptions);
        console.log(response);
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
    };
    async function fetchData() {
      try { const requestOptions = {
        method: 'GET', // Assuming you're fetching student data with a GET request
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          'Content-Type': 'application/json'
        }
      };
        const response = await fetch('/api/attendance/calculateAbsencesPerYear',requestOptions);
        const data = await response.json();
        const formattedData = data.map(item => ({
          id: item.country,
          label: item.country,
          value: item.totalStudents,
          absences: item.absences, // Use the absences field directly
        }));
        setPieData(formattedData);
        console.log(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    if (token) {
      // Token exists, perform actions (e.g., make authenticated API requests)
      console.log('Token exists:', token);
    } else {
      // Token does not exist, handle accordingly (e.g., redirect to login page)
      console.log('Token does not exist');
    }
    fetchTotalTeachers();
    fetchData();
  }, []);

  return (
    <>
  
  
      
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">taux d'abscence</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === "M",
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e,"M")}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === "W",
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, "W")}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody >
                
                <div className="chart">{
                  chartLineData==="dataM"?<Linechart  /> :<LinechartW />}
                            </div>
                
                </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">absence par filiaire </h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Barchart />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">nombre des etudiants et des professeurs</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">status</th>
                    <th scope="col">nomber total</th>
                    <th scope="col">nombre d'absence global</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">profs</th>
                    <td>{totalTeachers}</td>
                    <td>340</td>
                    
                  </tr>
                  
                  {pieData.map((item, index) => (
  <tr key={index}>
    <th scope="row">{item.label}</th>
    <td>{item.value}</td>
    <td>{item.absences}</td> {/* Use item.absences here */}
    
  </tr>
))}
                </tbody>
              </Table>
             
            </Card>
            
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Number of students</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="/students"
                      
                      size="sm"
                    >          

                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <CardBody >
                <div className="chart" >
                  <PieChart />
                </div>
                </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
