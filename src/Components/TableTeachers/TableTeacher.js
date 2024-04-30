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
import { FormLabel } from "react-bootstrap";
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

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/teachers")
  //     .then((response) => {
  //       setTeachers(response.data.data);
  //       // Fetch subjects for each teacher
  //       fetchSubjectsForTeachers(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching teachers:", error);
  //     });
  // }, []);

  // const fetchSubjectsForTeachers = (teachersData) => {
  //   // Extract teacher IDs
  //   const teacherIds = teachersData.map((teacher) => teacher._id);

  //   // Fetch subjects for each teacher
  //   axios
  //     .post("http://localhost:5000/teachers/teacherssubjects", { teacherIds })
  //     .then((response) => {
  //       setSubjects(response.data.subjects);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching subjects:", error);
  //     });
  // };

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
  const allOption = { value: "All Departments", Label: "All Departments" };
  const departmentsOptions = [
    allOption,
    ...departments.map((department) => ({
      value: department,
      Label: department,
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
  const allOptionsubjects = {
    value: "All Subjects",
    Label: "All Subjects",
  };
  const subjectOption = [
    allOptionsubjects,
    ...subjects.map((subject) => ({ value: subject, Label: subject })),
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
  }, [selectedDepartment, selectedSubject]);

  const [currentCIN, setCurrentCIN] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");

  const initialErrors = {
    FirstName: "",
    LastName: "",
    CIN: "",
    Email: "",
    Department: "",
  };
  const [errors, setErrors] = useState(initialErrors);

  const clearErrors = () => {
    setErrors(initialErrors);
  };

  const handleTeacher = (action) => {
    // Récupération des valeurs des champs
    //const id = document.getElementById("id").value;
    const FirstName = document.getElementById("FirstName").value;
    const LastName = document.getElementById("LastName").value;
    const CIN = document.getElementById("CIN").value;
    const Email = document.getElementById("Email").value;
    const department = document.getElementById("department").value;
    //console.log(department);

    if (!FirstName || !LastName || !CIN || !Email || !department) {
      console.error("One or more elements not found in the DOM");
      return; // Exit early if any required element is missing
    }
    // Vérification si le CIN est vide ou ne contient pas exactement 8 chiffres
    const CINError = !CIN
      ? "CIN is required"
      : CIN.length !== 8
      ? "CIN must be 8 digits long"
      : "";
    // Vérification si le CIN contient uniquement des chiffres
    const CINFormatError = !/^\d+$/.test(CIN)
      ? "CIN must contain only digits"
      : "";
    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Vérification si le prénom contient uniquement des lettres et des espaces
    const FirstNameFormatError = !/^[a-zA-Z\s]+$/.test(FirstName)
      ? "First name must contain only letters"
      : "";

    // Vérification si le nom de famille contient uniquement des lettres et des espaces
    const LastNameFormatError = !/^[a-zA-Z\s]+$/.test(LastName)
      ? "Last name must contain only letters"
      : "";

    // Combinaison des erreurs
    const newErrors = {
      FirstName: !FirstName ? "First name is required" : FirstNameFormatError,
      LastName: !LastName ? "Last name is required" : LastNameFormatError,
      CIN: CINError || CINFormatError,
      Email: !Email
        ? "Email is required"
        : !EmailRegex.test(Email)
        ? "Invalid Email format"
        : "",
    };

    // Mise à jour de l'état des erreurs
    setErrors(newErrors);

    // Vérification si des erreurs existent
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      const newTeacher = {
        FirstName: FirstName,
        LastName: LastName,
        CIN: CIN,
        Email: Email,
        Department: department,
      };

      if (action === "add") {
        // Ajouter un nouveau professeur
        axios
          .post("http://localhost:5000/teachers", newTeacher)
          .then((response) => {
            console.log("Teacher added:", response.data);
            console.log("newStudent:", newTeacher);
            setTeachers([...teachers, newTeacher]); // Add new teacher to the local state
            setModalOpen(false); // Close the modal after successful addition
          })
          .catch((error) => {
            console.error("Error adding teacher:", error);
          });
      } else if (action === "update") {
        const id = document.getElementById("id").value;
        newTeacher._id = id;

        // Mettre à jour les données du professeur
        // axios
        //   .put(`http://localhost:5000/teachers/${id}`, newTeacher)
        //   .then((response) => {
        //     console.log("Teacher updated:", response.data);
        //     setTeachers([...teachers.filter((t) => t._id !== id), newTeacher]); // Update teacher in the local state
        //     setUpdateModalOpen(false); // Close the update modal
        //   })
        //   .catch((error) => {
        //     console.error("Error updating teacher:", error);
        //   });
      }

      // Réinitialiser les champs du formulaire après l'ajout ou la mise à jour
      setFormData({
        FirstName: "",
        LastName: "",
        CIN: "",
        Email: "",
        Department: "",
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
                  handleFilterChange(selectedDepartment, newSubject)
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
                  <FormLabel for="FirstName">First Name:</FormLabel>
                  <Input
                    type="text"
                    name="FirstName"
                    id="FirstName"
                    placeholder="Enter the teacher's first name"
                    value={formData ? formData.FirstName : ""}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel for="LastName">Last Name:</FormLabel>
                  <Input
                    type="text"
                    name="LastName"
                    id="LastName"
                    placeholder="Enter the teacher's last name"
                    value={formData ? formData.LastName : ""}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel for="CIN">CIN:</FormLabel>
                  <Input
                    type="text"
                    name="CIN"
                    id="CIN"
                    placeholder="Enter the teacher's CIN"
                    value={formData ? formData.CIN : ""}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel for="department">Department:</FormLabel>
                  <Input
                    type="text"
                    name="department"
                    id="department"
                    placeholder="Enter the teacher's department"
                    value={formData ? formData.Department : ""}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel for="subject">Subject:</FormLabel>
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
                  <FormLabel for="class">Class:</FormLabel>
                  <SelectOptions
                    options={Class.map((className) => ({
                      value: className,
                      FormLabel: className,
                    }))}
                    selectedValue={selectedClass}
                    onOptionChange={(newClass) => setSelectedClass(newClass)}
                    placeholderText="Select Class"
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel for="majors">Majors:</FormLabel>
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
      <Modal isOpen={modalOpen} toggle={toggleModal} innerRef={modalRef}>
        <ModalHeader toggle={toggleModal}>Add a teacher</ModalHeader>
        <ModalBody>
          {/* Form fields to capture teacher data */}
          <FormGroup>
            <FormLabel for="FirstName">First Name</FormLabel>
            <Input
              type="text"
              name="FirstName"
              id="FirstName"
              placeholder="Enter the teacher's first name"
              // value={ formData.FirstName}
              // onChange={handleChange}
            />
            {errors.FirstName && (
              <span className="text-danger">{errors.FirstName}</span>
            )}
          </FormGroup>
          <FormGroup>
            <FormLabel for="LastName">Last Name</FormLabel>
            <Input
              type="text"
              name="LastName"
              id="LastName"
              placeholder="Enter the teacher's last name"
            />
            {errors.LastName && (
              <span className="text-danger">{errors.LastName}</span>
            )}
          </FormGroup>
          <FormGroup>
            <FormLabel for="CIN">Num CIN</FormLabel>
            <Input type="text" name="CIN" id="CIN" placeholder="Enter CIN" />
            {errors.CIN && <span className="text-danger">{errors.CIN}</span>}
          </FormGroup>
          <FormGroup>
            <FormLabel for="Email">Email</FormLabel>
            <Input
              type="text"
              name="Email"
              id="Email"
              placeholder="Enter Email"
            />
            {errors.Email && (
              <span className="text-danger">{errors.Email}</span>
            )}
          </FormGroup>
          <FormGroup>
            <FormLabel for="Department">Department</FormLabel>
            <Input
              type="text"
              name="Department"
              id="Department"
              placeholder="Enter the teacher's Department"
            />
            {errors.Department && (
              <span className="text-danger">{errors.Department}</span>
            )}
          </FormGroup>
        </ModalBody>
        <div className="modal-footer">
          <Button className="addbtn" onClick={() => handleTeacher("add")}>
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
