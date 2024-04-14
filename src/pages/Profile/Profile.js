
// reactstrap components
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
  // core components
  
  const Profile = (props) => {
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
                  <h3>
                    Soumaya Boukadida
                    <span className="font-weight-light">  22</span>
                  </h3>
                  <div className="h5 font-weight-300">
                   
                    RT 3 
                  </div>
                  <div className="h5 font-weight-300">
                    Cycle d'ingénieur
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
  
  export default Profile;
  