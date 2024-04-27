import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  Container,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "reactstrap";
import "./TableTeachers.css";
import { useNavigate } from "react-router-dom";
import SelectOptions from "../SelectOptions/SelectOptions";
import axios from "axios";
import { useRef } from "react";

const TableTeachers = () => {
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    _id: "",
    FirstName: "",
    LastName: "",
    CIN: "",
    Email: "",
    Department: "",
    Subject: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log("Updated formData:", formData);
  };
  const [departments, setDepartments] = useState([]);
  const majors = ["RT", "GL", "IIA", "IMI"];
  const Class = ["1", "2", "3", "4", "5"];

  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/teachers")
      .then((response) => {
        setTeachers(response.data.data);
        // Fetch subjects for each teacher
        fetchSubjectsForTeachers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });
  }, []);

  const fetchSubjectsForTeachers = (teachersData) => {
    // Extract teacher IDs
    const teacherIds = teachersData.map((teacher) => teacher._id);

    // Fetch subjects for each teacher
    axios
      .post("http://localhost:5000/teachers/teacherssubjects", { teacherIds })
      .then((response) => {
        setSubjects(response.data.subjects);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  };

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
        setSubjects(response.data.subjects);
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

  const [selectedDepartment, setselectedDepartment] = useState("");
  const [selectedSubject, setselectedSubject] = useState("");
  const [selectedteacher, setSelectedteacher] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // State for add teacher modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
    } // else if (selectedDepartment && selectedSubject) {
    //   if (selectedDepartment === "All Departments" && selectedSubject === "All Levels")
    //     endpoint = `http://localhost:5000/teachers`;
    //   else
    //     endpoint = `http://localhost:5000/teachers/majoryear/${selectedDepartment}/${selectedSubject}`;
    //}

    axios
      .get(endpoint)
      .then((response) => {
        console.log(response);
        setTeachers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching filtered teachers:", error);
        setTeachers([]);
      });
  }, [selectedDepartment,selectedSubject]);

  const [currentCIN, setCurrentCIN] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");

  const initialErrors = {
    FirstName: "",
    LastName: "",
    CIN: "",
    Email: "",
    // birthday: "",
    //year: "",
    //group: "",
    Department: "",
    Major: "",
  };
  const [errors, setErrors] = useState(initialErrors);

  const clearErrors = () => {
    setErrors(initialErrors);
  };
  const handleteacher = (action) => {
    // setErrors(initialErrors);

    // Récupération des valeurs des champs
    const FirstName = document.getElementById("FirstName").value;
    const lastName = document.getElementById("lastname").value;
    const cin = document.getElementById("cin").value;
    const email = document.getElementById("email").value;
    const department = document.getElementById("department").value;

    //let birthday = document.getElementById("birthday").value;
    //const major = document.getElementById("major").value;
    //const year = parseInt(document.getElementById("year").value); // Convertir niveau en entier
    //const group = parseInt(document.getElementById("group").value); // Convertir groupe en entier

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
    const FirstNameFormatError = !/^[a-zA-Z\s]+$/.test(FirstName)
      ? "First name must contain only letters "
      : "";

    // Vérification si le nom de famille contient uniquement des lettres et des espaces
    const lastNameFormatError = !/^[a-zA-Z\s]+$/.test(lastName)
      ? "Last name must contain only letters"
      : "";

    // Combinaison des erreurs
    const newErrors = {
      FirstName: !FirstName ? "First name is required" : FirstNameFormatError,
      lastName: !lastName ? "Last name is required" : lastNameFormatError,
      cin: cinError || cinFormatError,
      email: !email
        ? "Email is required"
        : !emailRegex.test(email)
        ? "Invalid Email format"
        : "",
      // birthday: !birthday ? "Birthday is required" : "",
      //major: !major ? "Major is required" : "",
      //year: !year ? "Year is required" : "",
      //group: !group ? "Group is required" : "",
    };

    // Mise à jour de l'état des erreurs
    console.log(newErrors);
    console.log("after new errrors FirstName", FirstName);
    setErrors(newErrors);
    console.log(errors);

    // Vérification si des erreurs existent
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (action === "add") {
      const newteacher = {
        FirstName: FirstName,
        LastName: lastName,
        CIN: cin,
        Email: email,
        Department: department,
        // Class:Class,
        // Birthday: birthday,
        // Major: major,
        // Year: year,
        //Group: group,
      };

      // Send new teacher data to server

      axios
        .post("http://localhost:5000/teachers", newteacher)
        .then((response) => {
          console.log("teacher added:", response.data);
          console.log("newteacher:", newteacher);
          setTeachers([...teachers, newteacher]); // Add new teacher to original data

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
      // birthday = new Date(document.getElementById("birthday").value)
      //  .toISOString()
      // .split("T")[0];
      const newteacher = {
        _id: id,
        FirstName: FirstName,
        LastName: lastName,
        CIN: cin,
        Email: email,
        Department: department,
        //Birthday: birthday,
        //Major: major,
        //Year: year,
        //Group: group,
      };

      axios
        .put(`http://localhost:5000/teachers/${newteacher?._id}`, newteacher)
        .then((response) => {
          console.log("teacher updated:", response.data);
          console.log("in if");
          setTeachers([...teachers, newteacher]); // Add new teacher to original data
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
    }
  };

  const handleDelete = (teacher) => {
    toggleDeleteModal();
    axios
      .delete(`http://localhost:5000/teachers/${teacher?._id}`)
      .then((response) => {
        console.log("teacher deleted:", response.data);
      })
      .catch((error) => {
        console.error("Error in deleting teacher:", error);
      });
  };

  const handleAddMore = () => {
    // Logic for adding more items
    console.log("Adding more...");
  };

  const handleAddTeacher = (newTeacher) => {
    setTeachers([...teachers, newTeacher]);
    setModalOpen(false);
    handleFilterChange(selectedDepartment /*selectedSubject*/);
  };

  const toggleDeleteModal = (teacher) => {
    setDeleteModalOpen(!deleteModalOpen);
    setSelectedteacher(teacher);
  };

  const toggleModal = () => {
    clearErrors(); // Effacer les erreurs lors de la fermeture

    setModalOpen(!modalOpen);
  }; // Toggle add teacher modal

  const toggleUpdateModal = (teacher) => {
    clearErrors(); // Effacer les erreurs lors de la fermeture
    setUpdateModalOpen(!updateModalOpen);
    setSelectedteacher(teacher);
    setCurrentCIN(teacher.CIN);
    setCurrentEmail(teacher.Email);

    setFormData(teacher);
  };
  const handleViewProfil = (teacher) => {
    console.log("View Profil");
    navigate("/Profile", { state: { selectedteacher: teacher } });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage] = useState(10); // Nombre d'étudiants par page

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
  return (
    <Container className="mt--7" fluid>
      {/* Table */}
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
                  handleFilterChange(selectedDepartment ,newSubject)
                }
                placeholderText="Subjects"
              />
            </div>
            {/* Add Teacher Button in Center */}
            <div className="col-lg-9 col-md-8 col-sm-10 d-flex AddEtudiant justify-content-end   ">
              <Button onClick={toggleModal} className="addbtn ">
                Add Professor
              </Button>
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
              {/* <th scope="col">Majors</th>
              <th scope="col">Classes</th> */}
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
              {/* <DropdownItem key="all" value="All Subjects">
                  All Subjects
                </DropdownItem> */}
              {teacher.Subjects && teacher.Subjects.map((subject) => (
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
                            toggleUpdateModal([teacher]);
                          }}
                        >
                          <i className="fas fa-pencil-alt" />
                          Update
                        </DropdownItem>
                        {/* Update Teacher Modal */}
                        <DropdownItem
                          href=""
                          onClick={(e) => e.preventDefault()}
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
                Update Teacher
              </ModalHeader>
              <ModalBody>
                {/* Form fields to capture updated teacher data */}
                <FormGroup>
                  <Label for="firstname">First Name:</Label>
                  <Input
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="Enter the teacher's first name"
                    value={formData ? formData.firstname : ""}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="lastname">Last Name:</Label>
                  <Input
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="Enter the teacher's last name"
                    value={formData ? formData.lastname : ""}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="cin">CIN:</Label>
                  <Input
                    type="text"
                    name="cin"
                    id="cin"
                    placeholder="Enter the teacher's CIN"
                    value={formData ? formData.cin : ""}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="department">Department:</Label>
                  <Input
                    type="text"
                    name="department"
                    id="department"
                    placeholder="Enter the teacher's department"
                    value={formData ? formData.department : ""}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="subject">Subject:</Label>
                  <Input
                    type="text"
                    name="subject"
                    id="subject"
                    placeholder="Enter the subject taught by the teacher"
                    value={formData ? formData.subject : ""}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="class">Class:</Label>
                  <SelectOptions
                    options={Class.map((className) => ({
                      value: className,
                      label: className,
                    }))}
                    selectedValue={selectedClass}
                    onOptionChange={(newClass) => setSelectedClass(newClass)}
                    placeholderText="Select Class"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="majors">Majors:</Label>
                  <Input type="select" name="majors" id="majors">
                    {majors.map((major) => (
                      <option key={major} value={major}>
                        {major}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </ModalBody>
              <div className="modal-footer">
                <Button
                  color="primary"
                  onClick={() => toggleUpdateModal("update")}
                >
                  Update
                </Button>
                <Button
                  color="link text-muted"
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
      {/* Add Teacher Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add a teacher</ModalHeader>
        <ModalBody>
          {/* Form fields to capture teacher data */}
          <FormGroup>
            <Label for="name">FirstName</Label>
            <Input
              type="text"
              name="firstname"
              id="firstname"
              placeholder="Enter the teacher's first name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="name">LastName</Label>
            <Input
              type="text"
              name="lastname"
              id="lastname"
              placeholder="Enter the teacher's last name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="name">CIN</Label>
            <Input
              type="text"
              name="cin"
              id="cin"
              placeholder="Enter the teacher's CIN"
            />
          </FormGroup>
          <FormGroup>
            <Label for="department">Department</Label>
            <Input
              type="text"
              name="department"
              id="department"
              placeholder="Enter the teacher's department"
            />
          </FormGroup>
          <FormGroup>
            <Label for="subject">Subject</Label>
            <Input
              type="text"
              name="subject"
              id="subject"
              placeholder="Enter the subject taught by the teacher"
            />
          </FormGroup>

          <FormGroup>
            <Label for="Class">Class</Label>
            <SelectOptions
              options={Class.map((className) => ({
                value: className,
                label: className,
              }))}
              selectedValue={selectedClass}
              onOptionChange={(newClass) => setSelectedClass(newClass)}
              placeholderText="Select Class"
            />
          </FormGroup>

          <FormGroup>
            <Label for="majors">Majors</Label>
            <Input type="select" name="majors" id="majors">
              {majors.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </Input>
          </FormGroup>
        </ModalBody>
        <div className="modal-footer">
          <Button color="secondary" onClick={() => handleAddMore()}>
            Add More
          </Button>
        </div>
        <div className="modal-footer">
          <Button
            color="primary"
            onClick={() =>
              handleAddTeacher({
                name: "",
                cin: "",
                department: "" /*, subject: "", classes: "", majors: ""*/,
              })
            }
          >
            Add
          </Button>
          <Button color="link text-muted" onClick={toggleModal}>
            Cancel
          </Button>
        </div>
      </Modal>
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
