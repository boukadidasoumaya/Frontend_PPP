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
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/attendance/calculateTotalStudentsPerYear');
        const data = await response.json();
        const formattedData = data.map(item => ({
          id: `Year ${item.year}`,
          label: `Year ${item.year}`,
          value: item.totalStudents,
        })).sort((a, b) => {
          const yearA = parseInt(a.label.split(' ')[1]);
          const yearB = parseInt(b.label.split(' ')[1]);
          return yearA - yearB;
        });
        setPieData(formattedData);
        console.log(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

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
              <CardBody>
                
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
                    <td>4,569</td>
                    <td>340</td>
                    <td>
                      <i className="fas fa-arrow-up text-success mr-3" /> 46,53%
                    </td>
                  </tr>
                  
                  {pieData.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">{item.label}</th>
                      <td>{item.value}</td>
                      <td>N/A</td>
                      <td>
                        <i className="fas fa-arrow-up text-success mr-3" />
                      </td>
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
              <CardBody>
                <div className="chart">
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
