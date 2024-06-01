import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Table,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Input,
} from "reactstrap";
import { FormLabel } from 'react-bootstrap';
import { Alert } from 'reactstrap';
import {toast, ToastContainer} from "react-toastify";

import "./TableStudents.css"
import SelectOptions from '../SelectOptions/SelectOptions';
import AlertMessage from '../Alert/Alert';
import axios from 'axios';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { set } from 'date-fns';
import Pagination from '../Pagination/Pagination';

const TableStudents = () => {
  const token = sessionStorage.getItem('jwtToken');

  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    _id: "",
    Student_id: "",
    FirstName: "",
    LastName: "",
    CIN: "",
    Email: "",
    Birthday: "",
    Major: "",
    Year: "",
    Group: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log("Updated formData:", formData);
  };

  const config = {
    headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
    },
};
  const [majors, setMajors] = useState([]);
  const [levels, setLevels] = useState([]);
  console.log("Token:", token);
  useEffect(() => {
    
    axios
      .get("http://localhost:5000/classes/majors",config)
      .then((response) => {
        setMajors(response.data.majors);
      })
      .catch((error) => {
        console.error("Error fetching majors:", error);
      });
  }, []);
  const allOption = { value: "All Majors", label: "All Majors" };
  const majorOptions = [
    allOption,
    ...majors.map((major) => ({ value: major, label: major })),
  ];

  useEffect(() => {
 
    axios
      .get("http://localhost:5000/classes/levels",config)
      .then((response) => {
        setLevels(response.data.levels);
      })
      .catch((error) => {
        console.error("Error fetching majors:", error);
      });
  }, []);
  const allOptionlevel = { value: "All Levels", label: "All Levels" };
  const levelOptions = [
    allOptionlevel,
    ...levels.map((level) => ({ value: level, label: level })),
  ];

  const groups = ["1", "2", "3", "4"];

const [selectedMajor, setSelectedMajor] = useState('');
const [selectedLevel, setSelectedLevel] = useState('');
const [selectedStudent, setSelectedStudent] = useState(null);
const [modalOpen, setModalOpen] = useState(false);
const [uploadModalOpen, setUploadModalOpen] = useState(false);
const [updateModalOpen, setUpdateModalOpen] = useState(false);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);

const handleFilterChange = (major, year) => {
  setSelectedMajor(major);
  setSelectedLevel(year);
};
// Fonction pour gérer le changement de Major
const handleMajorChange = (newMajor) => {
  setSelectedMajor(newMajor);
  // Si Master ou Doctorat, annuler la sélection de l'année
  if (newMajor === 'MASTER' || newMajor === 'DOCTORAT') {
    setSelectedLevel('');
  }
};

// Fonction pour gérer le changement d'année
const handleYearChange = (newYear) => {
  setSelectedLevel(newYear);
};

// Fonction utilitaire pour déterminer les options disponibles pour l'année en fonction de Major
const yearOptions = (major) => {
  if (major === 'CBA' || major === 'MPI') {
    // Si Major est CBA ou MPI, retourner seulement l'option 1 pour l'année
    return [{ value: '1', label: '1' }];
  } else if (major === 'MASTER' || major === 'DOCTORAT') {
    // Si Major est MASTER ou DOCTORAT, ne pas retourner d'options pour l'année
    return [];
  } else {
    // Pour tous les autres Majors, retourner les options de 2 à 5 pour l'année
    return [
      {value: 'All Levels', label: 'All Levels'},
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' },
    ];
  }
};
const disabledYear = (major) => {
  return major === 'MASTER' || major === 'DOCTORAT';
};
useEffect(() => {
  let endpoint = '';

    if (
      (!selectedMajor && !selectedLevel) ||
      (selectedMajor === "All Majors" && selectedLevel === "All Levels") ||
      (!selectedMajor && selectedLevel === "All Levels") ||
      (!selectedLevel && selectedMajor === "All Majors")
    ) {
      endpoint = `http://localhost:5000/students`;
    } else if (
      (selectedMajor && !selectedLevel) ||
      (selectedMajor && selectedLevel === "All Levels")
    ) {
      endpoint = `http://localhost:5000/students/majors/${selectedMajor}`;
    } else if (
      (selectedLevel && !selectedMajor) ||
      (selectedLevel && selectedMajor === "All Majors")
    ) {
      endpoint = `http://localhost:5000/students/year/${selectedLevel}`;
    } else if (selectedMajor && selectedLevel) {
      if (selectedMajor === "All Majors" && selectedLevel === "All Levels")
        endpoint = `http://localhost:5000/students`;
      else
        endpoint = `http://localhost:5000/students/majoryear/${selectedMajor}/${selectedLevel}`;
    }
  
    axios
      .get(endpoint, config)
      .then((response) => {
        setStudents(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching filtered students:", error);
        setStudents([]);
      });
  }, [selectedMajor, selectedLevel, students]);



  const initialErrors = {
    studentid: "",
    firstName: "",
    lastName: "",
    cin: "",
    email: "",
    birthday: "",
    major: "",
    year: "",
    group: "",
  };
  const [errors, setErrors] = useState(initialErrors);

  const clearErrors = () => {
    setErrors(initialErrors);
  };
  const handleStudent = (action) => {
    // setErrors(initialErrors);

    // Récupération des valeurs des champs
    const studentid = document.getElementById("studentid").value;
    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
    const cin = document.getElementById("cin").value;
    const email = document.getElementById("email").value;
    let birthday = document.getElementById("birthday").value;
    const major = document.getElementById("major").value;
    const year = parseInt(document.getElementById("year").value); // Convertir niveau en entier
    const group = parseInt(document.getElementById("group").value); // Convertir groupe en entier

    // Vérification si le CIN est vide ou ne contient pas exactement 8 chiffres
    const cinError = !cin
      ? "CIN is required"
      : cin.length !== 8
      ? "CIN must be 8 digits long"
      : "";
    // Vérification si le CIN contient uniquement des chiffres
    const cinFormatError = !/^\d+$/.test(cin)
      ? "CIN must contain only digits"
      : "";
      ///
      const idError = !studentid
      ? "Student ID is required"
      : studentid.length !== 7
      ? "Student ID must be 7 digits long"
      : "";
    const IDFormatError = !/^\d+$/.test(cin)
      ? "Student ID must contain only digits"
      : "";
      ///
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Vérification si le prénom contient uniquement des lettres et des espaces
    const firstNameFormatError = !/^[a-zA-Z\s]+$/.test(firstName)
      ? "First name must contain only letters "
      : "";

    // Vérification si le nom de famille contient uniquement des lettres et des espaces
    const lastNameFormatError = !/^[a-zA-Z\s]+$/.test(lastName)
      ? "Last name must contain only letters"
      : "";

    // Combinaison des erreurs
    const newErrors = {
      studentid: idError || IDFormatError,
      firstName: !firstName ? "First name is required" : firstNameFormatError,
      lastName: !lastName ? "Last name is required" : lastNameFormatError,
      cin: cinError || cinFormatError,
      email: !email
        ? "Email is required"
        : !emailRegex.test(email)
        ? "Invalid Email format"
        : "",
      birthday: !birthday ? "Birthday is required" : "",
      major: !major ? "Major is required" : "",
      year: !year ? "Year is required" : "",
      group: !group ? "Group is required" : "",
    };

    // Mise à jour de l'état des erreurs
    console.log(newErrors);
    console.log("after new errrors firstname", firstName);
    setErrors(newErrors);
    console.log(errors);

    // Vérification si des erreurs existent
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (action === "add") {
      const newStudent = {
        Student_id: studentid,
        FirstName: firstName,
        LastName: lastName,
        CIN: cin,
        Email: email,
        Birthday: birthday,
        Major: major,
        Year: year,
        Group: group,
      };

      // Send new student data to server

      axios
        .post("http://localhost:5000/students", newStudent,config)
        .then((response) => {
          console.log("Student added:", response.data);
          console.log("newStudent:", newStudent);
          setStudents([...students, newStudent]); // Add new student to original data

          setModalOpen(false);
        })
        .catch((error) => {
          const backendErrors = error.response.data.errors;
          console.log("backend", error.response.data);
          setErrors((prevErrors) => ({ ...prevErrors, ...backendErrors }));
          console.log("backend errors", backendErrors);
          if (backendErrors && backendErrors.cin) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              cin: "CIN already exists",
            }));
          }
          if (backendErrors && backendErrors.email) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "Email already exists",
            }));
          }
          console.log("errors", errors); // Close modal after adding
        });
    } else if (action === "update") {
      const id = document.getElementById("id").value;
      birthday = new Date(document.getElementById("birthday").value)
        .toISOString()
        .split("T")[0];
      const newStudent = {
        _id: id,
        FirstName: firstName,
        LastName: lastName,
        CIN: cin,
        Email: email,
        Birthday: birthday,
        Major: major,
        Year: year,
        Group: group,
      };

      axios
        .put(`http://localhost:5000/students/${newStudent?._id}`, newStudent,config)
        .then((response) => {
          console.log("Student updated:", response.data);
          console.log("in if");
          setStudents([...students, newStudent]); // Add new student to original data
          setUpdateModalOpen(!updateModalOpen);
        })
        .catch((error) => {
          const backendErrors = error.response.data.errors;
          console.log("backend", error.response.data);
          setErrors((prevErrors) => ({ ...prevErrors, ...backendErrors }));
          console.log("backend errors", backendErrors);
          if (backendErrors && backendErrors.cin) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              cin: "CIN already exists",
            }));
          }
          if (backendErrors && backendErrors.email) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "Email already exists",
            }));
          }
          if (backendErrors && backendErrors.Student_id) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              studentid: "ID already exists",
            }));
          }
          console.log("errors", errors); // Close modal after adding
        });
    }
  };

  const handleDelete = (student) => {
    toggleDeleteModal();
    axios
      .delete(`http://localhost:5000/students/${student?._id}`,config)
      .then((response) => {
        console.log("Student deleted:", response.data);
      })
      .catch((error) => {
        console.error("Error in deleting student:", error);
      });
  };

  const toggleDeleteModal = (student) => {
    setDeleteModalOpen(!deleteModalOpen);
    setSelectedStudent(student);
  };

  const toggleModal = () => {
    clearErrors(); // Effacer les erreurs lors de la fermeture

    setModalOpen(!modalOpen);
  }; // Toggle add student modal

  const toggleUpdateModal = (student) => {
    clearErrors(); // Effacer les erreurs lors de la fermeture
    setUpdateModalOpen(!updateModalOpen);
    setSelectedStudent(student);
    console.log("selectedStudent", formData);


    setFormData(student);
  };
  const handleViewProfil = (student) => {
    console.log("View Profil");
    navigate("/profile", {
      state: { selectedStudent: student, type: "student" },
    });
  };
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10); // Nombre d'étudiants par page

  // Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Index du premier et du dernier étudiant de la page actuelle
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  // Les étudiants à afficher sur la page actuelle
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  //upload 
  const [Alertvisible, setAlertVisible] = useState(false);
  const [Successvisible, setSuccessVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [UploadErrors, setUploadErrors] = useState({error:"",validationErrors:[]});

  
  const handleFileChange = (event) => {
    if (event.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
  
    const file = event.target.files[0];
    console.log("file", file);
    setSelectedFile(file);
  
    if (file && file.type === 'text/csv') {
      const formdata = new FormData();
      formdata.append('csv', file);
      axios.post("http://localhost:5000/students/upload", formdata, config)
        .then(response => {
          console.log('File uploaded');
          setSuccessVisible(!Successvisible);
         
        })
        .catch(error => {
          console.error('Error in uploading file:', error);
          setUploadModalOpen(!uploadModalOpen);
          setUploadErrors({
            error: error.response.data.error,
            validationErrors: error.response.data.validationErrors
          });
          setSelectedFile(null);
        });
    } else {
      setSelectedFile(null);
      setAlertVisible(!Alertvisible);
    }
  };
  
  const handleButtonClick = () => {
    setAlertVisible(false);
    document.getElementById('fileUpload').value = '';
    document.getElementById('fileUpload').click();
  };
  

  const onDismiss = () => setAlertVisible(!Alertvisible);
  const onDismisssuccess = () => setSuccessVisible(!Successvisible);
  const toggleUploadModal = () => setUploadModalOpen(!uploadModalOpen);
  // drop students
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const handleDrop = () => {
    
      axios.delete(`http://localhost:5000/students/drop/${selectedMajor}/${selectedLevel}`)
        .then(response => {
          console.log('All students with the sepecified critiria deleted:', response.data);
          setStudents([]);

        })
        .catch(error => {

          console.error('Error in deleting students:', error);
        });
      toggleDropModal();
  };

  const toggleDropModal = () => {
      setIsDropModalOpen(!isDropModalOpen);
  };

  const onDropClick = () => {
      toggleDropModal();
  };


    return (
        <Container className="mt--7" fluid>
        {/* Table */}
        <Row className='alertNotif'>
        {Alertvisible && (
          <div className='col alertMessage d-flex justify-content-end'>
              <Alert isOpen={Alertvisible} toggle={onDismiss} className="error alert-slide">
                Please Enter a CSV File 
              </Alert>
          </div>
        ) }
         {Successvisible && (
          <div className='col  d-flex justify-content-end'>
              <Alert isOpen={Successvisible} color="success" toggle={onDismisssuccess} className="">
                File Uploaded successfully
              </Alert>
          </div>
        ) }

        </Row>
        <Modal isOpen={uploadModalOpen} toggle={toggleUploadModal}>
                <ModalHeader color="danger" toggle={toggleUploadModal}>Error in Uploading File </ModalHeader>
                <ModalBody>
                  {UploadErrors.error ? (
                    <div>
                    
                      {UploadErrors.validationErrors && (<p className="danger">Check these lines: {UploadErrors.validationErrors}</p>)}

                      <p>Student_id , Emails and CINs. They must be unique and valid.</p>
                      <p>  Also check Major, Year, and Group.</p>
                      <p>There must be all these informations:</p>
                      <p>First Name, Last Name, CIN, Email, Birthday, Major, Year, Group</p>
                    
                      <p>Check the file and try again.</p>
                    </div>
                  ) : null}
                </ModalBody>
    
        </Modal>

        <Row>
        
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 ">
                
               <div className="col-lg-12 col-md-12 col-sm-12 d-flex  justify-content-center">
                 <h1 >Liste des étudiants</h1>
               </div>
            
               
              
                
              
                {/* Filter Dropdowns on Left */}
                <div className='row'>
                  <div className='col-lg-3 col-md-2 col-sm-2 d-flex major' >
                  
                  <SelectOptions
  options={majorOptions}
  selectedValue={selectedMajor}
  onOptionChange={(newMajor) => handleMajorChange(newMajor)}
  placeholderText="Major"
/>
<SelectOptions
  options={yearOptions(selectedMajor)}
  selectedValue={selectedLevel}
  onOptionChange={(newYear) => handleYearChange(newYear)}
  placeholderText="Year"
  disabled={disabledYear(selectedMajor)}
/>

                  </div>
                 {/* Centered "Liste des étudiants" */}
                
                 {/* Add Student Button in Center */}
                <div className="col-lg-9 col-md-10 col-sm-10 d-flex AddEtudiant justify-content-end   ">
                <div className=''>
                <input
                    type="file"
                    id="fileUpload"
                    style={{ display: 'none' }}
                    name='csv'
                    className=''
                    onChange={handleFileChange}
                  />
                 
                    <Button className="uploadbtn" onClick={handleButtonClick}>
                      Upload file
                    </Button>
                   
                  </div>
                  <div>
                    <Button className= "addbtn" onClick={toggleModal}>
                      Add  Student
                    </Button>
                  </div>
                </div>
                {/* Add Student Modal */}
                <Modal
                  isOpen={modalOpen}
                  toggle={toggleModal}
                  innerRef={modalRef}
                >
                  <ModalHeader toggle={toggleModal}>Add Student</ModalHeader>
                  <ModalBody>
                  <FormGroup>
                      <FormLabel for="StudentId">Student ID</FormLabel>
                      <Input
                        type="text"
                        name="StudentId"
                        id="studentid"
                        placeholder="Enter Student ID"
                      />
                      {errors.studentid && (
                        <span className="text-danger">{errors.studentid}</span>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="firstname">First Name</FormLabel>
                      <Input
                        type="text"
                        name="firstname"
                        id="firstname"
                        placeholder="Enter First Name"
                      />
                      {errors.firstName && (
                        <span className="text-danger">{errors.firstName}</span>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="lastname">Last Name</FormLabel>
                      <Input
                        type="text"
                        name="lastname"
                        id="lastname"
                        placeholder="Enter Last Name"
                      />
                      {errors.lastName && (
                        <span className="text-danger">{errors.lastName}</span>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <FormLabel for="cin">Num CIN</FormLabel>
                      <Input
                        type="text"
                        name="cin"
                        id="cin"
                        placeholder="Enter CIN"
                      />
                      {errors.cin && (
                        <span className="text-danger">{errors.cin}</span>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <FormLabel for="email">Email</FormLabel>
                      <Input
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Enter Email"
                      />
                      {errors.email && (
                        <span className="text-danger">{errors.email}</span>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <FormLabel for="birthday">Birthday</FormLabel>
                      <Input
                        type="date"
                        name="birthday"
                        id="birthday"
                        placeholder="Enter Date of Birth"
                      />
                      {errors.birthday && (
                        <span className="text-danger">{errors.birthday}</span>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <FormLabel for="major">Major</FormLabel>
                      <select
                        className="form-control shadow-none border-1 bg-transparent text-dark"
                        name="major"
                        id="major"
                      >
                        <option value="">Select Major</option>
                        {majors.map((major) => (
                          <option key={major} value={major}>
                            {major}
                          </option>
                        ))}
                      </select>
                      {errors.major && (
                        <span className="text-danger">{errors.major}</span>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <FormLabel for="level">Level</FormLabel>
                      <select
                        className="form-control shadow-none border-1 bg-transparent text-dark"
                        name="level"
                        id="year"
                      >
                        <option value="">Select Level</option>
                        {levels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      {errors.year && (
                        <span className="text-danger">{errors.year}</span>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <FormLabel for="group">Group</FormLabel>
                      <select
                        className="form-control shadow-none border-1 bg-transparent text-dark"
                        name="group"
                        id="group"
                      >
                        <option value="">Select Group</option>
                        {groups.map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                      </select>
                      {errors.group && (
                        <span className="text-danger">{errors.group}</span>
                      )}
                    </FormGroup>
                  </ModalBody>
                  <div className="modal-footer">
                    <Button
                      className="addbtn"
                      onClick={() => {
                        handleStudent("add");
                      }}
                    >
                      Add Student
                    </Button>
                    <Button color="link text-muted" onClick={toggleModal}>
                      Cancel
                    </Button>
                  </div>
                </Modal>

              </div>
            </CardHeader>
            {/* Table Content */}
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                <th scope="col">Student ID</th>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Major</th>
                  <th scope="col">Level</th>
                  <th scope="col">Group</th>
                  <th scope="col">Email</th>
                  <th scope="col">CIN</th>
                  <th scope="col">Birthday</th>
                  <th scope="col">Actions </th>
                </tr>
              </thead>
              <tbody>
                {/* Afficher les étudiants ou un message s'il n'y en a aucun */}
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      No Student found
                    </td>
                  </tr>
                ) : (
                  currentStudents.map((student) => (
                    <tr key={student._id}>
                      <td>{student.Student_id}</td>
                      <td>{student.FirstName}</td>
                      <td>{student.LastName}</td>
                      <td>{student.Major}</td>
                      <td>{student.Year}</td>
                      <td>{student.Group}</td>
                      <td>{student.Email}</td>
                      <td>{student.CIN}</td>
                      <td>{new Date(student.Birthday).toLocaleDateString()}</td>
                      <td className="">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                              onClick={() => {
                                handleViewProfil(student);
                              }}
                            >
                              <i className="fa-solid fa-eye"></i>
                              View Absence
                            </DropdownItem>

                            <DropdownItem
                              href=""
                              onClick={() => {
                                toggleUpdateModal(student);
                              }}
                            >
                              <i className="fas fa-pencil-alt" />
                              Update
                            </DropdownItem>
                            {/* Modal de mise à jour de l'étudiant */}

                            <DropdownItem
                              href=""
                              onClick={() => {
                                toggleDeleteModal(student);
                              }}
                            >
                              <i className="fas fa-trash" />
                              Delete
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))
                )}

                <Modal
                  isOpen={updateModalOpen}
                  toggle={() => toggleUpdateModal(selectedStudent)}
                >
                  <ModalHeader toggle={() => toggleUpdateModal(null)}>
                    Modify Student
                  </ModalHeader>
                  <ModalBody>
                    {/* Form fields to capture updated student data */}
                    <FormGroup>
                      <FormLabel for="StudentId">Student ID</FormLabel>
                      <Input
                        type="text"
                        name="Student_id"
                        id="studentid"
                        onChange={handleChange}
                        placeholder="Enter Student ID "
                        value={formData ? formData.Student_id : ""}
                      />
                      {errors.studentid && (
                        <span className="text-danger">{errors.studentid}</span>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="firstname">First Name</FormLabel>
                      <input
                        type="text"
                        style={{ display: "none" }}
                        id="id"
                        value={formData ? formData._id : ""}
                      />

                        <Input type="text" name="FirstName" id="firstname" placeholder="Enter First Name" value={formData ? formData.FirstName : ''} onChange={handleChange} />
                        {errors.firstName && <span className="text-danger">{errors.firstName}</span>}

                      </FormGroup>
                      <FormGroup>
                        <FormLabel for="lastname">Last Name</FormLabel>
                        <Input type="text" name="LastName" id="lastname" placeholder="Enter Last Name" value={formData ? formData.LastName : ''} onChange={handleChange}/>
                        {errors.lastName && <span className="text-danger">{errors.lastName}</span>}

                      </FormGroup>
                      <FormGroup>
                        <FormLabel for="cin">Num CIN</FormLabel>
                        <Input type="text" name="CIN" id="cin" placeholder="Enter CIN" value={formData ? formData.CIN : ''} onChange={handleChange}/>
                        {errors.cin && <span className="text-danger">{errors.cin}</span>}

                      </FormGroup>
                      <FormGroup>
                        <FormLabel for="email">Email</FormLabel>
                        <Input type="text" name="Email" id="email" placeholder="Enter Email" value={formData ? formData.Email : ''} onChange={handleChange}/>
                        {errors.email && <span className="text-danger">{errors.email}</span>}

                      </FormGroup>
                      <FormGroup>
                        <FormLabel for="birthday">Birthday</FormLabel>
                        <Input type="date" name="Birthday" id="birthday" placeholder="Enter Date of Birth" value={formData ? formData.Birthday.slice(0, 10) : ''}  onChange={handleChange} />
                        {errors.birthday && <span className="text-danger">{errors.birthday}</span>}

                      </FormGroup>
                      <FormGroup>
                        <FormLabel for="Major">Major</FormLabel>
                        <select className="form-control shadow-none border-1 bg-transparent text-dark" name="Major" id="major" value={formData ? formData.Major : ''} onChange={handleChange}>
                          <option value="">Select Major</option>
                          {majors.map((major) => (
                            <option key={major} value={major}>
                              {major}
                            </option>
                          ))}
                        </select>
                        {errors.major && <span className="text-danger">{errors.major}</span>}

                      </FormGroup>
                      <FormGroup>
                        <FormLabel for="Level">Level</FormLabel>
                        <select className="form-control shadow-none border-1 bg-transparent text-dark" name="Year" id="year" value={formData ? formData.Year : ''} onChange={handleChange}>
                          <option value="">Select Level</option>
                          {levels.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                        {errors.year && <span className="text-danger">{errors.year}</span>}

                      </FormGroup>
                      <FormGroup>
                        <FormLabel for="Group">Group</FormLabel>
                        <select className="form-control shadow-none border-1 bg-transparent text-dark" name="Group" id="group" value={formData ? formData.Group : ''} onChange={handleChange}>
                          <option value="">Select Group</option>
                          {groups.map((group) => (
                            <option key={group} value={group}>
                              {group}
                            </option>
                          ))}
                        </select>
                        {errors.group && <span className="text-danger">{errors.group}</span>}

                      </FormGroup>
                    </ModalBody>
                    <div className="modal-footer">
                      <Button className='addbtn' onClick={() => {handleStudent("update")}}>
                        Save Changes
                      </Button>
                      <Button color="link" onClick={() => toggleUpdateModal(null)}>
                        Cancel
                      </Button>
                    </div>
              </Modal>
              <Modal isOpen={deleteModalOpen} toggle={toggleDeleteModal}>
                <ModalHeader toggle={toggleDeleteModal}>Confirmation</ModalHeader>
                <ModalBody>
                  <p>Are you sure you want to delete this student?</p>
                </ModalBody>
                <div className="modal-footer">
                  <Button className='btn1' onClick={()=>{handleDelete(selectedStudent)}}>Delete</Button>
                  <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
                </div>
              </Modal>
          </tbody>

              </Table>
              {currentStudents.length === 0 ? null : (
 <>
   <div className="d-flex justify-content-center mt-3">
     <Pagination
        itemsPerPage={studentsPerPage} 
        totalItems={students.length}
       paginate={paginate}
       currentPage={currentPage}
     />
   </div>
   {selectedMajor && selectedLevel && (<div className='col-12 d-flex justify-content-end'>
                        
                        <button  onClick={()=>onDropClick()} class="delete-button">
                            <svg class="delete-svgIcon" viewBox="0 0 448 512">
                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                                          </svg>
                        </button>
                    </div>)}
                    <Modal isOpen={isDropModalOpen} toggle={toggleDropModal}>
                <ModalHeader toggle={toggleDropModal}>Confirm Deletion</ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete the students of {selectedMajor} {selectedLevel}?</p>
                    <Button color="danger" onClick={handleDrop}>Delete</Button>
                    <Button color="secondary" onClick={toggleDropModal}>Cancel</Button>
                </ModalBody>
            </Modal>
 </>
  
)}

 

            </Card>
          </div>
        
        </Row>
        
     
            
      </Container>
    );
}

export default TableStudents;
