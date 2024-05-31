import React, { useState, useEffect } from "react";
import {
  Button,Card,CardHeader,Container,FormGroup,Input,Label,Modal,ModalBody,ModalHeader,Table,UncontrolledDropdown,DropdownToggle,DropdownMenu,DropdownItem,Pagination,Row,Alert,
} from "reactstrap";
import { FormLabel } from 'react-bootstrap';
import "./TableTeachers.css";
import { useNavigate } from "react-router-dom";
import { useRef } from 'react';
import SelectOptions from "../SelectOptions/SelectOptions";
import axios from "axios";

const TableTeachers = () => {
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [selectedDepartment, setselectedDepartment] = useState("");
  const [selectedSubject, setselectedSubject] = useState("");
  const [selectedteacher, setSelectedteacher] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // State for add teacher modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
   
    CIN: "",
    FirstName: "",
    LastName: "",
    Email: "",
    Department: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log("Updated formData:", formData);
  };

  const [departments, setDepartments] = useState([]);

  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/teachers/departments")
      .then((response) => {
        setDepartments(response.data.departments);
      })
      .catch((error) => {
        console.error("Error fetching Departments:", error);
      });
  }, []);
  const allOption = { value: "All Departments", label: "All Departments" };
  const departmentsOptions = [
    allOption,
    ...departments.map((department) => ({
      value: department,
      label: department,
    })),
  ];

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/subjects/subjects")
      .then((response) => {
        console.log("Response from API:", response.data.data);
        setSubjects(response.data.data);
        console.log("Subjects:", subjects);
      })
      .catch((error) => {
        console.error("Error fetching subject:", error);
      });
  }, []);
  const allOptionsubjects = { value: "All Subjects", label: "All Subjects" };
  const subjectOption = [
    allOptionsubjects,
    ...subjects.map((subject) => ({ value: subject, label: subject })),
  ];

  const handleFilterChange = (Department, Subject) => {
    setselectedDepartment(Department);
    setselectedSubject(Subject);
  };

  useEffect(() => {
    let endpoint = "";

    if (
      (!selectedDepartment && !selectedSubject) ||
      (selectedDepartment === "All Departments" &&
        selectedSubject === "All Subjects") ||
      (!selectedDepartment && selectedSubject === "All Subjects") ||
      (!selectedSubject && selectedDepartment === "All Departments")
    )
      endpoint = `http://localhost:5000/teachers`;
    else if (
      (selectedDepartment && !selectedSubject) ||
      (selectedDepartment && selectedSubject === "All Subjects")
    ) {
      endpoint = `http://localhost:5000/teachers/departments/${selectedDepartment}`;
    } else if (
      (selectedSubject && !selectedDepartment) ||
      (selectedSubject && selectedDepartment === "All Departments")
    ) {
      console.log("Subject: ", selectedSubject);
      endpoint = `http://localhost:5000/teachers/subjects/${selectedSubject}`;
    } else if (selectedDepartment && selectedSubject) {
      if (
        selectedDepartment === "All Departments" &&
        selectedSubject === "All Subjects"
      )
        endpoint = `http://localhost:5000/teachers`;
      else
        endpoint = `http://localhost:5000/teachers/departments/subjects/${selectedDepartment}/${selectedSubject}`;
    }

    axios
      .get(endpoint)
      .then((response) => {
        setTeachers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching filtered teachers:", error);
        setTeachers([]);
      });
  }, [selectedDepartment, selectedSubject]);

  const [currentCIN, setCurrentCIN] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");

  const initialErrors = {
    cin: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  };
  const [errors, setErrors] = useState(initialErrors);

  const clearErrors = () => {
    setErrors(initialErrors);
  };

  const handleAddTeacher = () => {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const cin = document.getElementById("cin").value;
    const email = document.getElementById("email").value;
    const department = document.getElementById("department").value;
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Vérification si le prénom contient uniquement des lettres et des espaces
    const FirstNameFormatError = !/^[a-zA-Z\s]+$/.test(firstName)
      ? "First name must contain only letters "
      : "";

    // Vérification si le nom de famille contient uniquement des lettres et des espaces
    const lastNameFormatError = !/^[a-zA-Z\s]+$/.test(lastName)
      ? "Last name must contain only letters"
      : "";

    // Combinaison des erreurs
    const newErrors = {
      firstName: !firstName ? "First name is required" : FirstNameFormatError,
      lastName: !lastName ? "Last name is required" : lastNameFormatError,
      cin: cinError || cinFormatError,
      email: !email
        ? "Email is required"
        : !emailRegex.test(email)
        ? "Invalid Email format"
        : "",
      department: !department ? "Department is required" : "",
    };

    // Mise à jour de l'état des erreurs
    console.log(newErrors);
    console.log("after new errrors Department", department);
    setErrors(newErrors);
    console.log(errors);

    // Vérification si des erreurs existent
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    const newTeacher = {
      FirstName: firstName,
      LastName: lastName,
      CIN: cin,
      Email: email,
      Department: department,
    };

    axios
      .post("http://localhost:5000/teachers", newTeacher)
      .then((response) => {
        console.log("Teacher added:", response.data);
        setTeachers([...teachers, newTeacher]); // Add new teacher to the local state
        setModalOpen(false); // Close the modal after successful addition
      })
      .catch((error) => {
        const backendErrors = error.response.data.errors;
        console.log("backend", error.response.data);
        setErrors((prevErrors) => ({ ...prevErrors, ...backendErrors }));
        console.log("backend errors", backendErrors);
        if (backendErrors && backendErrors.cin) {
          setErrors((backendErrors) => ({
            ...backendErrors,
            cin: "CIN already exists",
          }));
        }
        if (backendErrors && backendErrors.email) {
          setErrors((backendErrors) => ({
            ...backendErrors,
            email: "Email already exists",
          }));
        }
        console.log("errors", errors); // Close modal after adding
      });
  };

  const toggleDeleteModal = (teacher) => {
    setSelectedteacher(teacher);
    setDeleteModalOpen(!deleteModalOpen);
  };

  const handleDelete = (teacher) => {
    toggleDeleteModal();
    axios
      .delete(`http://localhost:5000/teachers/teacher/${teacher?._id}`)
      .then((response) => {
        console.log("teacher deleted:", response.data);
      })
      .catch((error) => {
        console.error("Error in deleting teacher:", error);
      });
  };

  const toggleModal = () => {
    clearErrors();

    setModalOpen(!modalOpen);
  };

  const toggleUpdateModal = (teacher) => {
    clearErrors(); // Effacer les erreurs lors de la fermeture
    setUpdateModalOpen(!updateModalOpen);
    setSelectedteacher(teacher);
    console.log("selected teacher", teacher);
    if (teacher){
    const {  CIN, FirstName, LastName, Email, Department } = teacher;
    
    // Set the formData state with the destructured properties
    setFormData({
      CIN,
      FirstName,
      LastName,
      Email,
      Department,
    });
  }
  else{
    setFormData({
      CIN: "",
      FirstName: "",
      LastName: "",
      Email: "",
      Department: "",
    });
  }
    console.log("formData", formData);
  };
  const handleViewProfil = (teacher) => {
    console.log("View Profil");
    navigate("/TeacherProfile", { state: { selectedteacher: teacher } });
  };

  const handleUpdateTeacher = () => {
    console.log("staaaaaaaaaaart");
    setErrors(initialErrors);

    // Récupération des valeurs des champs
   
    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
    const cin = document.getElementById("cin").value;
    const email = document.getElementById("email").value;
    const department = document.getElementById("department").value;

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
      firstName: !firstName ? "First name is required" : firstNameFormatError,
      lastName: !lastName ? "Last name is required" : lastNameFormatError,
      cin: cinError || cinFormatError,
      email: !email
        ? "Email is required"
        : !emailRegex.test(email)
        ? "Invalid Email format"
        : "",
      department: !department ? "Department is required" : "",
    };

    // Mise à jour de l'état des erreurs
    console.log(newErrors);
    console.log("after new errrors Dep", department);
    setErrors(newErrors);
    console.log(errors);

    // Vérification si des erreurs existent
    //const hasErrors = Object.values(newErrors).some((error) => error !== "");

  
    const newTeacher = {
      FirstName: firstName,
      LastName: lastName,
      CIN: cin,
      Email: email,
      Department: department,
    };

    axios
      .put(`http://localhost:5000/teachers/teacher/${selectedteacher._id}`, newTeacher)
      .then((response) => {
        console.log("Teacher updated:", response.data);
        setTeachers([...teachers, newTeacher]); // Add new teacher to original data
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
        console.log("errors", errors); // Close modal after adding
      });
      console.log("enddddddddddd");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage] = useState(10);

  // Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Index du premier et du dernier étudiant de la page actuelle
  const indexOfLastteacher = currentPage * teachersPerPage;
  const indexOfFirstteacher = indexOfLastteacher - teachersPerPage;
  // Les profs à afficher sur la page actuelle
  const currentteachers = teachers.slice(
    indexOfFirstteacher,
    indexOfLastteacher
  );

  //upload
  const [Alertvisible, setAlertVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [UploadErrors, setUploadErrors] = useState([]);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const handleFileChange = (event) => {
    if (event.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }

    const file = event.target.files[0];
    console.log("file", file);
    setSelectedFile(file);

    if (file && file.type === "text/csv") {
      const formdata = new FormData();
      formdata.append("csv", file);
      axios
        .post("http://localhost:5000/teachers/upload", formdata, config)
        .then((response) => {
          console.log("File uploaded");
        })
        .catch((error) => {
          console.error("Error in uploading file:", error);
          setUploadModalOpen(!uploadModalOpen);
          setUploadErrors(error.response.data.problematicLines);
          setSelectedFile(null);
        });
    } else {
      setSelectedFile(null);
      setAlertVisible(!Alertvisible);
    }
  };

  const handleButtonClick = () => {
    setAlertVisible(false);
    document.getElementById("fileUpload").value = "";
    document.getElementById("fileUpload").click();
  };

  const onDismiss = () => setAlertVisible(!Alertvisible);
  const toggleUploadModal = () => setUploadModalOpen(!uploadModalOpen);
  return (
    <Container className="mt--7" fluid>
      {/* Table */}
      <Row className="alertNotif">
        {Alertvisible && (
          <div className="col alertMessage d-flex justify-content-end">
            <Alert
              isOpen={Alertvisible}
              toggle={onDismiss}
              className="alert-slide"
            >
              Please Enter a CSV File
            </Alert>
          </div>
        )}
      </Row>
      <Modal isOpen={uploadModalOpen} toggle={toggleUploadModal}>
        <ModalHeader color="danger" toggle={toggleUploadModal}>
          Error in Uploading File{" "}
        </ModalHeader>
        <ModalBody>
          {UploadErrors ? (
            <div>
              <p>Error in inserting Teachers into the database.</p>
              <p>Check these lines : {UploadErrors.join(" / ")}</p>
              <p>Emails and CIN must be unique and valid.</p>
              <p>Check the file and try again.</p>
            </div>
          ) : null}
        </ModalBody>
      </Modal>

      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0">
              {/* Filter Dropdowns on Left */}
              <div className="row">
                <h1 className="col-12 d-flex justify-content-center listEnseignant">
                  List of Professors
                </h1>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-2 d-flex filter">
                  <SelectOptions
                    options={departmentsOptions}
                    selectedValue={selectedDepartment}
                    onOptionChange={(newDepartment) =>
                      handleFilterChange(newDepartment, selectedSubject)
                    }
                    placeholderText="Departments"
                  />
                  <SelectOptions
                    options={subjectOption}
                    selectedValue={selectedSubject}
                    onOptionChange={(newSubject) =>
                      handleFilterChange(selectedDepartment, newSubject)
                    }
                    placeholderText="Subjects"
                  />
                </div>
                {/* Add Teacher Button in Center */}
                <div className="col-lg-9 col-md-10 col-sm-10 d-flex AddEtudiant justify-content-end   ">
                  <div className="">
                    <input
                      type="file"
                      id="fileUpload"
                      style={{ display: "none" }}
                      name="csv"
                      className=""
                      onChange={handleFileChange}
                    />

                    <Button className="uploadbtn" onClick={handleButtonClick}>
                      Upload file
                    </Button>
                  </div>
                  <div>
                    <Button onClick={toggleModal} className="addbtn ">
                      Add Professor
                    </Button>
                  </div>
                  {/* Add Teacher Modal */}
                  <Modal isOpen={modalOpen} toggle={toggleModal} innerRef={modalRef}>
                    <ModalHeader toggle={toggleModal}>
                      Add a teacher
                    </ModalHeader>
                    <ModalBody>
                      {/* Form fields to capture teacher data */}
                      <FormGroup>
                        <Label for="firstName">First Name</Label>
                        <Input
                          type="text"
                          name="firstName"
                          id="firstName"
                          placeholder="Enter the teacher's first name"
                          // value={formData.firstName}
                          // onChange={handleChange}
                        />
                        {errors.firstName && (
                          <span className="text-danger">
                            {errors.firstName}
                          </span>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label for="lastName">Last Name</Label>
                        <Input
                          type="text"
                          name="lastName"
                          id="lastName"
                          placeholder="Enter the teacher's last name"
                          // value={formData.lastName}
                          // onChange={handleChange}
                        />
                        {errors.lastName && (
                          <span className="text-danger">{errors.lastName}</span>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label for="cin">CIN</Label>
                        <Input
                          type="text"
                          name="cin"
                          id="cin"
                          placeholder="Enter the teacher's CIN"
                          // value={formData.cin}
                          // onChange={handleChange}
                        />
                        {errors.cin && (
                          <span className="text-danger">{errors.cin}</span>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                          type="text"
                          name="email"
                          id="email"
                          placeholder="Enter the teacher's email"
                          // value={formData.email}
                          // onChange={handleChange}
                        />
                        {errors.email && (
                          <span className="text-danger">{errors.email}</span>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label for="department">Department</Label>
                        <Input
                          type="text"
                          name="department"
                          id="department"
                          placeholder="Enter the teacher's Department"
                          // value={formData.department}
                          // onChange={handleChange}
                        />
                        {errors.department && (
                          <span className="text-danger">
                            {errors.department}
                          </span>
                        )}
                      </FormGroup>
                    </ModalBody>
                    <div className="modal-footer">
                      <Button className="addbtn" onClick={handleAddTeacher}>
                        Add
                      </Button>
                      <Button color="link text-muted" onClick={toggleModal}>
                        Cancel
                      </Button>
                    </div>
                  </Modal>
                </div>
              </div>
            </CardHeader>
            {/* Table Content */}
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th scope="col">First Name</th>
                  <th scope="col">last Name</th>
                  <th scope="col">CIN</th>
                  <th scope="col">Email</th>
                  <th scope="col">Department</th>
                  <th scope="col">Subject:</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {/* Display filtered teachers or message if none found */}
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      No teacher found for the selected department
                    </td>
                  </tr>
                ) : (
                  teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>{teacher.FirstName}</td>
                      <td>{teacher.LastName}</td>
                      <td>{teacher.CIN}</td>
                      <td>{teacher.Email}</td>
                      <td>{teacher.Department}</td>
                      <td>
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
                            {/* {
                            <DropdownItem key="all" value="All Subjects">
                              All Subjects
                            </DropdownItem>
                          } */}
                            {teacher.Subjects &&
                              teacher.Subjects.map((subject) => (
                                <DropdownItem key={subject} value={subject}>
                                  {subject}
                                </DropdownItem>
                              ))}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                      {/* <td>{teacher.Class}</td>
                    <td>{teacher.Majors}</td> */}
                      <td className="">
                        {/* Dropdown menu for actions */}
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
                                handleViewProfil(teacher);
                              }}
                            >
                              <i className="fa-solid fa-eye"></i>
                              View Profile
                            </DropdownItem>
                            <DropdownItem
                              href=""
                              onClick={() => {
                                toggleUpdateModal(teacher);
                              }}
                            >
                              <i className="fas fa-pencil-alt" />
                              Update
                            </DropdownItem>
                            {/* Update Teacher Modal */}
                            <DropdownItem
                              href=""
                              onClick={() => {
                                toggleDeleteModal(teacher);
                              }}
                            >
                              <i className="fas fa-trash" />
                              Delete
                            </DropdownItem>
                            {/* Include any additional dropdown items as needed */}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))
                )}

                <Modal
                  isOpen={updateModalOpen}
                  toggle={() => toggleUpdateModal(selectedteacher)}
                >
                  <ModalHeader toggle={() => toggleUpdateModal(null)}>
                    Modify Teacher
                  </ModalHeader>
                  <ModalBody>
                      {/* Form fields to capture teacher data */}
                      <FormGroup>
                  

                      <Input
                        type="text"
                        name="FirstName"
                        id="firstname"
                        placeholder="Enter First Name"
                        value={formData ? formData.FirstName : ""}
                        onChange={handleChange}
                      />
                      {errors.firstName && (
                        <span className="text-danger">{errors.firstName}</span>
                      )}
                    </FormGroup>
                      <FormGroup>
                        <Label for="lastname">Last Name</Label>
                        <Input
                          type="text"
                          name="LastName"
                          id="lastname"
                          placeholder="Enter the teacher's last name"
                          value={formData.LastName}
                          onChange={handleChange}
                        />
                        {errors.lastName && (
                          <span className="text-danger">{errors.lastName}</span>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label for="cin">CIN</Label>
                        <Input
                          type="text"
                          name="CIN"
                          id="cin"
                          placeholder="Enter the teacher's CIN"
                          value={formData.CIN}
                          onChange={handleChange}
                        />
                        {errors.cin && (
                          <span className="text-danger">{errors.cin}</span>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                          type="text"
                          name="Email"
                          id="email"
                          placeholder="Enter the teacher's email"
                          value={formData.Email}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <span className="text-danger">{errors.email}</span>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label for="department">Department</Label>
                        <Input
                          type="text"
                          name="Department"
                          id="department"
                          placeholder="Enter the teacher's Department"
                          value={formData.Department}
                          onChange={handleChange}
                        />
                        {errors.department && (
                          <span className="text-danger">
                            {errors.department}
                          </span>
                        )}
                      </FormGroup>
                    </ModalBody>
                  <div className="modal-footer">
                    <Button
                      className="addbtn"
                      onClick={() => {
                        handleUpdateTeacher();
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      color="link"
                      onClick={() => toggleUpdateModal(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Modal>
              </tbody>
            </Table>

            {currentteachers.length === 0 ? null : (
              <div className="d-flex justify-content-center mt-3">
                <Pagination
                  teachersPerPage={teachersPerPage}
                  totalTeachers={teachers.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              </div>
            )}
          </Card>
        </div>
      </Row>

      <Modal isOpen={deleteModalOpen} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirmation</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete this teacher?</p>
        </ModalBody>
        <div className="modal-footer">
          <Button
            className="addbtn"
            onClick={() => {
              handleDelete(selectedteacher);
            }}
          >
            Delete
          </Button>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </Container>
  );
};

export default TableTeachers;