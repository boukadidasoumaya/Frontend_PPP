

import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import ReactTable from 'react-table';
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,

  Input,
  FormText,
  NavLink,
} from "reactstrap";
import { FormLabel } from 'react-bootstrap';
import {toast, ToastContainer} from "react-toastify";

import "./TableStudents.css"
import SelectOptions from '../SelectOptions/SelectOptions';
import axios from 'axios';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { set } from 'date-fns';
import Pagination from '../Pagination/Pagination';

const TableStudents = () => {
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    _id: '',
    FirstName: '',
    LastName: '',
    CIN: '',
    Email: '',
    Birthday: '',
    Major: '',
    Year: '',
    Group: ''
  });


  //upload 
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    const file= event.target.files[0];
    if (file && file.type === 'csv') {
      setSelectedFile(file);
      // Vous pouvez ajouter ici d'autres manipulations du fichier si nécessaire
    } else {
      setSelectedFile(null);
      alert('Veuillez sélectionner un fichier CSV.');
      toast.error("Please Select a CSV File.");

    }
    // Vous pouvez ajouter ici d'autres manipulations du fichier si nécessaire
  };

  const handleButtonClick = () => {
    document.getElementById('fileUpload').click();
  };
  const CloseButton = ({ closeToast }) => (
    <i
        className="fa-sharp fa-solid fa-xmark"
        onClick={closeToast}
        style={{ color: "white", fontSize: "1.2rem" }}
    ></i>
);
    return (
        <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 ">
                <div className='row'>
                <h1 className="col-lg-12 col-md-12 col-sm-12 d-flex  justify-content-center listEtudiant">Liste des étudiants</h1>
                </div>
                {/* Filter Dropdowns on Left */}
                <div className='row'>
                
                 {/* Add Student Button in Center */}
                <div className="col-lg-9 col-md-10 col-sm-10 d-flex AddEtudiant justify-content-end   ">
                <div className=''>
                <input
                    type="file"
                    id="fileUpload"
                    style={{ display: 'none' }}
                    className=''
                    onChange={handleFileChange}
                  />
                 
                    <Button className="uploadbtn" onClick={handleButtonClick}>
                      Upload file
                    </Button>
                   
                  </div>
                
                </div>
                  {/* Add Student Modal */}
        
              </div>
              </CardHeader>
        
          

            </Card>
          </div>
          <ToastContainer
                    autoClose="1000"
                    theme="colored"
                    closeButton={CloseButton}
                />
        </Row>
      
       
        
      </Container>
    );
}

export default TableStudents;
