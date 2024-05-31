import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import ReactTable from "react-table";
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
import { FormLabel } from "react-bootstrap";
import "./TableCourses.css";
import SelectOptions from "../SelectOptions/SelectOptions";
import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";
import Pagination from "../Pagination/Pagination";

const TableCourses = () => {
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    _id: "",
    SubjectName: "",
    Module: "",
    Coeff: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log("Updated formData:", formData);
  };
  const token = sessionStorage.getItem('jwtToken');

  const [teachers, setTeachers] = useState([]);
  const [majors, setMajors] = useState([]);
  const [levels, setLevels] = useState([]);
  const config = {
    headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
    },
};
  useEffect(() => {
    axios
      .get("http://localhost:5000/teachers",config)
      .then((response) => {
        setTeachers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching majors:", error);
      });
  }, []);
  const allOptionTeachers = { value: "All Teachers", label: "All Teachers" };
  const TeacherOptions = [
    allOptionTeachers,
    ...(Array.isArray(teachers)
      ? teachers.map((teacher) => ({ value: teacher, label: teacher }))
      : []),
  ];

  useEffect(() => {
    axios
      .get("http://localhost:5000/classes/majors",config)
      .then((response) => {
        setMajors(response.data.majors);
        console.log("Majors fetched:", response.data.majors);
        console.log("Majors:", majors);
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
      .get("http://localhost:5000/classes/levels", config)
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

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // State for add subject modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleFilterChange = (teacher, major, year) => {
    setSelectedTeacher(teacher);
    setSelectedMajor(major);
    setSelectedLevel(year);
  };

  useEffect(() => {
    let endpoint = "";

    if (
      (!selectedMajor && !selectedLevel & !selectedTeacher) ||
      (selectedMajor === "All Majors" &&
        selectedLevel === "All Levels" &&
        selectedTeacher === "All Teachers") ||
      (!selectedTeacher && !selectedMajor && selectedLevel === "All Levels") ||
      (!selectedTeacher && !selectedLevel && selectedMajor === "All Majors") ||
      (!selectedMajor && !selectedLevel && selectedTeacher === "All Teachers")
    ) {
      endpoint = `http://localhost:5000/api/subjects`;
    } else if (
      (selectedMajor && !selectedLevel && !selectedTeacher) ||
      (selectedMajor && selectedLevel === "All Levels" && !selectedTeacher) ||
      (selectedMajor && selectedTeacher === "All Teachers" && !selectedLevel)
    ) {
      endpoint = `http://localhost:5000/api/subjects/majors/${selectedMajor}`;
    } else if (
      (selectedLevel && !selectedMajor && !selectedTeacher) ||
      (selectedLevel && selectedMajor === "All Majors" && !selectedTeacher) ||
      (selectedLevel && selectedTeacher === "All Teachers" && !selectedMajor)
    ) {
      endpoint = `http://localhost:5000/api/subjects/year/${selectedLevel}`;
    } else if (
      (selectedMajor && selectedLevel && !selectedTeacher) ||
      (selectedMajor && selectedLevel && selectedTeacher === "All Teachers")
    ) {
      if (selectedMajor === "All Majors" && selectedLevel === "All Levels")
        endpoint = `http://localhost:5000/api/subjects`;
      else
        endpoint = `http://localhost:5000/api/subjects/majoryear/${selectedMajor}/${selectedLevel}`;
    } else if (
      (selectedMajor && selectedTeacher && !selectedLevel) ||
      (selectedMajor && selectedTeacher && selectedLevel === "All Levels")
    ) {
      if (selectedMajor === "All Majors" && selectedTeacher === "All Teachers")
        endpoint = `http://localhost:5000/api/subjects`;
      else
        endpoint = `http://localhost:5000/api/subjects/teachermajor/${selectedTeacher}/${selectedMajor}`;
    } else if (
      (selectedLevel && selectedTeacher && !selectedMajor) ||
      (selectedLevel && selectedTeacher && selectedMajor === "All Majors")
    ) {
      if (selectedLevel === "All Levels" && selectedTeacher === "All Teachers")
        endpoint = `http://localhost:5000/api/subjects`;
      else
        endpoint = `http://localhost:5000/api/subjects/teacheryear/${selectedTeacher}/${selectedLevel}`;
    } else if (selectedMajor && selectedLevel && selectedTeacher) {
      if (
        selectedMajor === "All Majors" &&
        selectedLevel === "All Levels" &&
        selectedTeacher === "All Teachers"
      )
        endpoint = `http://localhost:5000/api/subjects`;
      else
        endpoint = `http://localhost:5000/api/subjects/teacheryear/${selectedTeacher}/${selectedMajor}/${selectedLevel}`;
    }

    axios
      .get(endpoint)
      .then((response) => {
        setSubjects(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching filtered subjects:", error);
        setSubjects([]);
      });
  }, [selectedTeacher, selectedMajor, selectedLevel, subjects]);

  const initialErrors = {
    SubjectName: "",
    Module: "",
    Coeff: "",
  };
  const [errors, setErrors] = useState(initialErrors);

  const clearErrors = () => {
    setErrors(initialErrors);
  };
  const handleSubject = (action) => {
    // Récupération des valeurs des champs
    const SubjectName = document.getElementById("subjectname").value;
    const Module = document.getElementById("module").value;
    const coeff = parseInt(document.getElementById("coeff").value);

    const coeffError = !coeff
      ? "Coeff is required"
      : coeff.length !== 2
      ? "Coeff must be 2 digit long"
      : "";
    // Vérification si le Coeff contient uniquement des chiffres
    const coeffFormatError = !/^\d+$/.test(coeff)
      ? "Coeff must contain only digits"
      : "";

    const SubjectNameFormatError = !/^[a-zA-Z\s]+$/.test(SubjectName)
      ? "SubjectName must contain only letters "
      : "";

    const ModuleFormatError = !/^[a-zA-Z\s]+$/.test(Module)
      ? "Module must contain only letters"
      : "";

    // Combinaison des erreurs
    const newErrors = {
      SubjectName: !SubjectName
        ? "SubjectName is required"
        : SubjectNameFormatError,
      Module: !Module ? "Module is required" : ModuleFormatError,
      coeff: coeffError || coeffFormatError,
    };

    // Mise à jour de l'état des erreurs
    console.log(newErrors);
    console.log("after new errrors SubjectName", SubjectName);
    setErrors(newErrors);
    console.log(errors);

    // Vérification si des erreurs existent
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (action === "add") {
      const newSubject = {
        SubjectName: SubjectName,
        Module: Module,
        Coeff: coeff,
      };

      // Send new subject data to server
      axios
        .post("http://localhost:5000/api/subjects", newSubject,config)
        .then((response) => {
          console.log("Subject added:", response.data);
          console.log("newSubject:", newSubject);
          setSubjects([...subjects, newSubject]); // Add new subject to original data

          setModalOpen(false);
        })
        .catch((error) => {
          const backendErrors = error.response.data.errors;
          console.log("backend", error.response.data);
          setErrors((prevErrors) => ({ ...prevErrors, ...backendErrors }));
          console.log("backend errors", backendErrors);
          if (
            backendErrors &&
            backendErrors.SubjectName &&
            backendErrors.coeff
          ) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "Subject already exists",
            }));
          }
          console.log("errors", errors); // Close modal after adding
        });
    } else if (action === "update") {
      const id = document.getElementById("id").value;
      const newSubject = {
        _id: id,
        SubjectName: SubjectName,
        Module: Module,
        Coeff: coeff,
      };

      axios
        .put(
          `http://localhost:5000/api/subjects/${newSubject?._id}`,
          newSubject,config
        )
        .then((response) => {
          console.log("Subject updated:", response.data);
          console.log("in if");
          setSubjects([...subjects, newSubject]); // Add new subject to original data
          setUpdateModalOpen(!updateModalOpen);
        })
        .catch((error) => {
          const backendErrors = error.response.data.errors;
          console.log("backend", error.response.data);
          setErrors((prevErrors) => ({ ...prevErrors, ...backendErrors }));
          console.log("backend errors", backendErrors);
          if (
            backendErrors &&
            backendErrors.SubjectName &&
            backendErrors.coeff
          ) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "Subject already exists",
            }));
          }
          console.log("errors", errors); // Close modal after adding
        });
    }
  };

  const handleDelete = (subject) => {
    toggleDeleteModal();
    axios
      .delete(`http://localhost:5000/api/subjects/${subject?._id}`,config)
      .then((response) => {
        console.log("Subject deleted:", response.data);
      })
      .catch((error) => {
        console.error("Error in deleting subject:", error);
      });
  };

  const toggleDeleteModal = (subject) => {
    setDeleteModalOpen(!deleteModalOpen);
    setSelectedSubject(subject);
  };

  const toggleModal = () => {
    clearErrors(); // Effacer les erreurs lors de la fermeture

    setModalOpen(!modalOpen);
  }; // Toggle add subject modal

  const toggleUpdateModal = (subject) => {
    clearErrors(); // Effacer les erreurs lors de la fermeture
    setUpdateModalOpen(!updateModalOpen);
    setSelectedSubject(subject);
    setFormData(subject);
  };
  // const handleViewProfil = (subject) => {
  //   console.log("View Profil");
  //   navigate("/profile", { state: { selectedSubject: subject } });
  // };
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [subjectsPerPage] = useState(10); // Nombre d'matières par page

  // Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Index du premier et du dernier matière de la page actuelle
  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  // Les matières à afficher sur la page actuelle
  const currentSubjects = subjects.slice(
    indexOfFirstSubject,
    indexOfLastSubject
  );

  return (
    <Container className="mt--7" fluid>
      {/* Table */}
      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0 ">
              <div className="row">
                <h1 className="col-lg-12 col-md-12 col-sm-12 d-flex  justify-content-center listEtudiant">
                  Liste des matières
                </h1>
              </div>
              {/* Filter Dropdowns on Left */}
              <div className="row">
                <div className="col-lg-3 col-md-2 col-sm-2 d-flex major">
                  <SelectOptions
                    options={TeacherOptions}
                    selectedValue={selectedTeacher}
                    onOptionChange={(newTeacher) =>
                      handleFilterChange(
                        newTeacher,
                        selectedMajor,
                        selectedLevel
                      )
                    }
                    placeholderText="Teacher"
                  />
                  <SelectOptions
                    options={majorOptions}
                    selectedValue={selectedMajor}
                    onOptionChange={(newMajor) =>
                      handleFilterChange(
                        selectedTeacher,
                        newMajor,
                        selectedLevel
                      )
                    }
                    placeholderText="Major"
                  />
                  <SelectOptions
                    options={levelOptions}
                    selectedValue={selectedLevel}
                    onOptionChange={(newLevel) =>
                      handleFilterChange(
                        selectedTeacher,
                        selectedMajor,
                        newLevel
                      )
                    }
                    placeholderText="Level"
                  />
                </div>
                {/* Centered "Liste des matières" */}

                {/* Add Subject Button in Center */}
                <div className="col-lg-9 col-md-10 col-sm-10 d-flex AddEtudiant justify-content-end   ">
                  <Button className="addbtn" onClick={toggleModal}>
                    Add Subject
                  </Button>
                </div>
                {/* Add Subject Modal */}
                <Modal
                  isOpen={modalOpen}
                  toggle={toggleModal}
                  innerRef={modalRef}
                >
                  <ModalHeader toggle={toggleModal}>Add Subject</ModalHeader>
                  <ModalBody>
                    <FormGroup>
                      <FormLabel for="subjectname">Subject Name</FormLabel>
                      <Input
                        type="text"
                        name="subjectname"
                        id="subjectname"
                        placeholder="Enter Subject Name"
                      />
                      {errors.SubjectName && (
                        <span className="text-danger">
                          {errors.SubjectName}
                        </span>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="module">Module</FormLabel>
                      <Input
                        type="text"
                        name="module"
                        id="module"
                        placeholder="Enter Module"
                      />
                      {errors.Module && (
                        <span className="text-danger">{errors.Module}</span>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <FormLabel for="coeff">Coeff</FormLabel>
                      <Input
                        type="text"
                        name="coeff"
                        id="coeff"
                        placeholder="Enter Coeff"
                      />
                      {errors.coeff && (
                        <span className="text-danger">{errors.coeff}</span>
                      )}
                    </FormGroup>
                  </ModalBody>
                  <div className="modal-footer">
                    <Button
                      className="addbtn"
                      onClick={() => {
                        handleSubject("add");
                      }}
                    >
                      Add Subject
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
                  <th scope="col">Subject Name</th>
                  <th scope="col">Module</th>
                  <th scope="col">Coeff</th>
                  <th scope="col">Major</th>
                  <th scope="col">Level</th>
                  <th scope="col">Teacher</th>
                  <th scope="col">Actions </th>
                </tr>
              </thead>
              <tbody>
                {/* Afficher les matières ou un message s'il n'y en a aucun */}
                {subjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      No Subject found
                    </td>
                  </tr>
                ) : (
                  currentSubjects.map((subject) => (
                    <tr key={subject._id}>
                      <td>{subject.SubjectName}</td>
                      <td>{subject.module}</td>
                      <td>{subject.coeff}</td>
                      <td>{subject.major}</td>
                      <td>{subject.year}</td>
                      <td>{subject.teacher_name}</td>
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
                            {/* <DropdownItem
                              onClick={() => {
                                handleViewProfil(subject);
                              }}
                            >
                              <i className="fa-solid fa-eye"></i>
                              View Absence
                            </DropdownItem> */}

                            <DropdownItem
                              href=""
                              onClick={() => {
                                toggleUpdateModal(subject);
                              }}
                            >
                              <i className="fas fa-pencil-alt" />
                              Update
                            </DropdownItem>
                            {/* Modal de mise à jour de l'matière */}

                            <DropdownItem
                              href=""
                              onClick={() => {
                                toggleDeleteModal(subject);
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
                  toggle={() => toggleUpdateModal(selectedSubject)}
                >
                  <ModalHeader toggle={() => toggleUpdateModal(null)}>
                    Modify Subject
                  </ModalHeader>
                  <ModalBody>
                    {/* Form fields to capture updated subject data */}
                    <FormGroup>
                      <FormLabel for="subjectname">Subject Name</FormLabel>
                      <input
                        type="text"
                        style={{ display: "none" }}
                        id="id"
                        value={formData ? formData._id : ""}
                      />

                      <Input
                        type="text"
                        name="SubjectName"
                        id="subjectname"
                        placeholder="Enter Subject Name"
                        value={formData ? formData.SubjectName : ""}
                        onChange={handleChange}
                      />
                      {errors.SubjectName && (
                        <span className="text-danger">
                          {errors.SubjectName}
                        </span>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="module">Module</FormLabel>
                      <Input
                        type="text"
                        name="module"
                        id="module"
                        placeholder="Enter Module"
                        value={formData ? formData.module : ""}
                        onChange={handleChange}
                      />
                      {errors.Module && (
                        <span className="text-danger">{errors.Module}</span>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="coeff">Coeff</FormLabel>
                      <Input
                        type="text"
                        name="Coeff"
                        id="coeff"
                        placeholder="Enter Coeff"
                        value={formData ? formData.Coeff : ""}
                        onChange={handleChange}
                      />
                      {errors.coeff && (
                        <span className="text-danger">{errors.coeff}</span>
                      )}
                    </FormGroup>
                  </ModalBody>
                  <div className="modal-footer">
                    <Button
                      className="addbtn"
                      onClick={() => {
                        handleSubject("update");
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
                <Modal isOpen={deleteModalOpen} toggle={toggleDeleteModal}>
                  <ModalHeader toggle={toggleDeleteModal}>
                    Confirmation
                  </ModalHeader>
                  <ModalBody>
                    <p>Are you sure you want to delete this subject?</p>
                  </ModalBody>
                  <div className="modal-footer">
                    <Button
                      className="addbtn"
                      onClick={() => {
                        handleDelete(selectedSubject);
                      }}
                    >
                      Delete
                    </Button>
                    <Button color="secondary" onClick={toggleDeleteModal}>
                      Cancel
                    </Button>
                  </div>
                </Modal>
              </tbody>
            </Table>
            {currentSubjects.length === 0 ? null : (
              <div className="d-flex justify-content-center mt-3">
                <Pagination
                  subjectsPerPage={subjectsPerPage}
                  totalSubjects={subjects.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              </div>
            )}
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default TableCourses;
