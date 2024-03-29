import * as React from 'react';
//import { LineChart } from '@mui/x-charts/LineChart';
import { useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
import { ResponsiveLine } from '@nivo/line'
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
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

import Header from "../Components/Header/Header.js";
import { colors } from '@mui/material';

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");

 
  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };
  const data0 = {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: 'white',
      tension: 0.1
    }]
  };
  return (
    <>
      <Header />
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
                    <h2 className="text-white mb-0">Sales value</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
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
                
                <div className="chart">
                <ResponsiveLine
        data={[
    
          {
            "id": "germany",
            "color": "hsl(355, 70%, 50%)",
            "data": [
              {
                "x": "plane",
                "y": 238
              },
              {
                "x": "helicopter",
                "y": 215
              },
              {
                "x": "boat",
                "y": 213
              },
              {
                "x": "train",
                "y": 9
              },
              {
                "x": "subway",
                "y": 291
              },
              {
                "x": "bus",
                "y": 51
              },
              {
                "x": "car",
                "y": 176
              },
              {
                "x": "moto",
                "y": 29
              },
              {
                "x": "bicycle",
                "y": 80
              },
              {
                "x": "horse",
                "y": 283
              },
              {
                "x": "skateboard",
                "y": 6
              },
              {
                "x": "others",
                "y": 2
              }
            ]
          },
          
            
        ]}
        theme={{
          
          "text": {
              "fontSize": 11,
              "fill": "#DDDBDB",
              "outlineWidth": 0,
              "outlineColor": "transparent"
          },
          "axis": {
              "domain": {
                  "line": {
                      "stroke": "#DDDBDB",
                      "strokeWidth": 1
                  }
              },
              "legend": {
                  "text": {
                      "fontSize": 12,
                      "fill": "#DDDBDB",
                      "outlineWidth": 0,
                      "outlineColor": "transparent"
                  }
              },
              "ticks": {
                  "line": {
                      "stroke": "#DDDBDB",
                      "strokeWidth": 1
                  },
                  "text": {
                      "fontSize": 11,
                      "fill": "#DDDBDB",
                      "outlineWidth": 0,
                      "outlineColor": "#DDDBDB",
                  }
              }
          },
          "grid": {
              "line": {
                  "stroke": "#DDDBDB",
                  "strokeWidth": 1
              }
          },
          "legends": {
              "title": {
                  "text": {
                      "fontSize": 11,
                      "fill": "#DDDBDB",
                      "outlineWidth": 0,
                      "outlineColor": "transparent"
                  }
              },
              "text": {
                  "fontSize": 11,
                  "fill": "#DDDBDB",
                  "outlineWidth": 0,
                  "outlineColor": "transparent"
              },
              "ticks": {
                  "line": {},
                  "text": {
                      "fontSize": 10,
                      "fill": "#DDDBDB",
                      "outlineWidth": 0,
                      "outlineColor": "transparent"
                  }
              }
          },
          
          
           
        
      }}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.2f"
        curve="natural"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 0,
            tickPadding: 15,
            tickRotation: 0,
            legend: '',
            legendOffset: 36,
            legendPosition: 'middle',
            truncateTickAt: 0
        }}
        axisLeft={{
            tickSize: 0,
            tickPadding: 15,
            tickRotation: 0,
            legend: '',
            legendOffset: -40,
            legendPosition: 'middle',
            truncateTickAt: 0
        }}
        colors={['#EDEDED']}

        enableGridX={false}
        enableGridY={false}
        lineWidth={6}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        areaBaselineValue={20}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[]}
    />
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
