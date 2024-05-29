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
import { FormLabel } from "react-bootstrap";
import "./TableCourses.css";
import SelectOptions from "../SelectOptions/SelectOptions";
import axios from "axios";
import { useRef } from "react";
import Pagination from "../Pagination/Pagination";

const TableCourses = () => {
  const modalRef = useRef(null);
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

  const [Modules, setModules] = useState([]);
  const [majors, setMajors] = useState([]);
  const [levels, setLevels] = useState([]);
  const modules = formData.Module;

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/subjects/modules")
      .then((response) => {
        setModules(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching Modules:", error);
      });
  }, []);
  const allOptionModules = { value: "All Modules", label: "All Modules" };
  const ModuleOptions = [
    allOptionModules,
    ...Modules.map((Module) => ({ value: Module, label: Module })),
  ];

  useEffect(() => {
    axios
      .get("http://localhost:5000/classes/majors")
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
      .get("http://localhost:5000/classes/levels")
      .then((response) => {
        setLevels(response.data.levels);
      })
      .catch((error) => {
        console.error("Error fetching levels:", error);
      });
  }, []);
  const allOptionlevel = { value: "All Levels", label: "All Levels" };
  const levelOptions = [
    allOptionlevel,
    ...levels.map((level) => ({ value: level, label: level })),
  ];

  const [selectedModule, setSelectedModule] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // State for add subject modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleFilterChange = (module, major, year) => {
    setSelectedModule(module);
    setSelectedMajor(major);
    setSelectedLevel(year);
  };

  useEffect(() => {
    let endpoint = "";

    if (
      (!selectedMajor && !selectedLevel & !selectedModule) ||
      (selectedMajor === "All Majors" &&
        selectedLevel === "All Levels" &&
        selectedModule === "All Modules") ||
      (!selectedModule && !selectedMajor && selectedLevel === "All Levels") ||
      (!selectedModule && !selectedLevel && selectedMajor === "All Majors") ||
      (!selectedMajor && !selectedLevel && selectedModule === "All Modules") ||
      (selectedMajor === "All Majors" &&
        selectedLevel === "All Levels" &&
        !selectedModule) ||
      (selectedMajor === "All Majors" &&
        selectedModule === "All Modules" &&
        !selectedLevel) ||
      (selectedLevel === "All Levels" &&
        selectedModule === "All Modules" &&
        !selectedMajor)
    ) {
      endpoint = `http://localhost:5000/api/subjects`;
    } else if (
      (selectedMajor && !selectedLevel && !selectedModule) ||
      (selectedMajor && selectedLevel === "All Levels" && !selectedModule) ||
      (selectedMajor && selectedModule === "All Modules" && !selectedLevel)
    ) {
      endpoint = `http://localhost:5000/api/subjects/majors/${selectedMajor}
`;
    } else if (
      (selectedLevel && !selectedMajor && !selectedModule) ||
      (selectedLevel && selectedMajor === "All Majors" && !selectedModule) ||
      (selectedLevel && selectedModule === "All Modules" && !selectedMajor)
    ) {
      endpoint = `http://localhost:5000/api/subjects/year/${selectedLevel}`;
    } else if (
      (selectedModule && !selectedMajor && !selectedLevel) ||
      (selectedModule && selectedMajor === "All Majors" && !selectedLevel) ||
      (selectedModule && selectedLevel === "All Levels" && !selectedMajor)
    ) {
      endpoint = `http://localhost:5000/api/subjects/module/${selectedModule}`;
    } else if (
      (selectedMajor && selectedLevel && !selectedModule) ||
      (selectedMajor && selectedLevel && selectedModule === "All Modules")
    ) {
      if (selectedMajor === "All Majors" && selectedLevel === "All Levels")
        endpoint = `http://localhost:5000/api/subjects`;
      else
        endpoint = `http://localhost:5000/api/subjects/majoryear/${selectedMajor}/${selectedLevel}`;
    } else if (
      (selectedMajor && selectedModule && !selectedLevel) ||
      (selectedMajor && selectedModule && selectedLevel === "All Levels")
    ) {
      if (selectedMajor === "All Majors" && selectedModule === "All Modules")
        endpoint = `http://localhost:5000/api/subjects`;
      else
        endpoint = `http://localhost:5000/api/subjects/modulemajor/${selectedModule}/${selectedMajor}`;
    } else if (
      (selectedLevel && selectedModule && !selectedMajor) ||
      (selectedLevel && selectedModule && selectedMajor === "All Majors")
    ) {
      if (selectedLevel === "All Levels" && selectedModule === "All Modules")
        endpoint = `http://localhost:5000/api/subjects`;
      else
        endpoint = `http://localhost:5000/api/subjects/moduleyear/${selectedModule}/${selectedLevel}`;
    } else if (selectedMajor && selectedLevel && selectedModule) {
      if (
        selectedMajor === "All Majors" &&
        selectedLevel === "All Levels" &&
        selectedModule === "All Modules"
      )
        endpoint = `http://localhost:5000/api/subjects`;
      else
        endpoint = `http://localhost:5000/api/subjects/moduleyear/${selectedModule}/${selectedMajor}/${selectedLevel}`;
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
  }, [selectedModule, selectedMajor, selectedLevel, subjects]);

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
    const Module = document.getElementById("Module").value;
    const Coeff = parseInt(document.getElementById("Coeff").value);

    const CoeffError = !Coeff
      ? "Coeff is required"
      : Coeff.toString().length !== 1
      ? "Coeff must be 1 digit long"
      : "";
    // Vérification si le Coeff contient uniquement des chiffres
    const CoeffFormatError = !/^\d+$/.test(Coeff)
      ? "Coeff must contain only digits"
      : "";

    const SubjectNameFormatError = !/^[a-zA-Z0-9\séèàêâûîïô]+$/.test(
      SubjectName
    )
      ? "SubjectName must contain only letters and numbers"
      : "";

    const ModuleFormatError = !/^[a-zA-Z0-9\séèàêâûîïô:-]+$/.test(Module)
      ? "Module must contain only letters and numbers"
      : "";

    // Combinaison des erreurs
    const newErrors = {
      SubjectName: !SubjectName
        ? "SubjectName is required"
        : SubjectNameFormatError,
      Module: !Module ? "Module is required" : ModuleFormatError,
      Coeff: CoeffError || CoeffFormatError,
    };

    // Mise à jour de l'état des erreurs
    console.log(newErrors);
    console.log("after new errrors SubjectName", SubjectName);
    setErrors(newErrors);
    console.log(errors);

    if (action === "add") {
      const newSubject = {
        SubjectName: SubjectName,
        Module: Module,
        Coeff: Coeff,
      };

      // Send new subject data to server
      axios
        .post("http://localhost:5000/api/subjects", newSubject)
        .then((response) => {
          setSubjects([...subjects, response.data.data]); // Add new subject to original data
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
            backendErrors.Coeff &&
            backendErrors.Module
          ) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              combinedError: "Subject already exists",
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
        Coeff: Coeff,
      };

      axios
        .put(
          `http://localhost:5000/api/subjects/${newSubject?._id}`,
          newSubject
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
        });
    }
  };

  const handleDelete = (subject) => {
    toggleDeleteModal();
    axios
      .delete(`http://localhost:5000/api/subjects/${subject?._id}`)
      .then((response) => {
        console.log("Subject deleted:", response.data);
        setSubjects([...response.data]);
        console.log("subjects:", subjects);
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

  const [currentPage, setCurrentPage] = useState(1);
  const [subjectsPerPage] = useState(10); // Nombre de matières par page;

  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = subjects.slice(
    indexOfFirstSubject,
    indexOfLastSubject
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt--7" fluid>
      {/* Table */}
      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0 ">
              <div className="col-lg-12 col-md-12 col-sm-12 d-flex  justify-content-center listSubjects">
                <h1>Liste des matières</h1>
              </div>
              {/* Filter Dropdowns on Left */}
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-4 d-flex major">
                  <SelectOptions
                    options={ModuleOptions}
                    selectedValue={selectedModule}
                    onOptionChange={(newModule) =>
                      handleFilterChange(
                        newModule,
                        selectedMajor,
                        selectedLevel
                      )
                    }
                    placeholderText="All Modules"
                  />
                  <SelectOptions
                    options={majorOptions}
                    selectedValue={selectedMajor}
                    onOptionChange={(newMajor) =>
                      handleFilterChange(
                        selectedModule,
                        newMajor,
                        selectedLevel
                      )
                    }
                    placeholderText="All Majors"
                  />
                  <SelectOptions
                    options={levelOptions}
                    selectedValue={selectedLevel}
                    onOptionChange={(newLevel) =>
                      handleFilterChange(
                        selectedModule,
                        selectedMajor,
                        newLevel
                      )
                    }
                    placeholderText="All Levels"
                  />
                </div>
                {/* Centered "Liste des matières" */}

                {/* Add Subject Button in Center */}
                <div className="col-lg-9 col-md-10 col-sm-10 d-flex AddSubject justify-content-end   ">
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
                      <FormLabel for="Module">Module</FormLabel>
                      <select
                        className="form-control shadow-none border-1 bg-transparent text-dark"
                        name="Module"
                        id="Module"
                      >
                        <option value="">Select Module</option>
                        {Modules.map((Module) => (
                          <option key={Module} value={Module}>
                            {Module}
                          </option>
                        ))}
                      </select>
                      {errors.Module && (
                        <span className="text-danger">{errors.Module}</span>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="Coeff">Coeff</FormLabel>
                      <Input
                        type="text"
                        name="Coeff"
                        id="Coeff"
                        placeholder="Enter Coeff"
                      />
                      {errors.Coeff && (
                        <span className="text-danger">{errors.Coeff}</span>
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
                    {errors.combinedError && (
                      <span className="text-danger">
                        {errors.combinedError}
                      </span>
                    )}
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
                  <th scope="col">Class</th>
                  <th scope="col">Teacher</th>
                  <th scope="col">Actions </th>
                </tr>
              </thead>
              <tbody>
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
                      <td>{subject.Module}</td>
                      <td>{subject.Coeff}</td>
                      <td>
                        {subject.classes_years?.length > 0
                          ? subject.classes_years.join(" / ")
                          : "N/A"}
                      </td>
                      <td>
                        {subject.teacher_name?.length > 0
                          ? subject.teacher_name.join(" / ")
                          : "N/A"}
                      </td>
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
                              href=""
                              onClick={() => {
                                toggleUpdateModal(subject);
                              }}
                            >
                              <i className="fas fa-pencil-alt" />
                              Update
                            </DropdownItem>
                            {/* Modal de mise à jour de l'matière*/}

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
                      <FormLabel for="Module">Module</FormLabel>
                      <select
                        className="form-control shadow-none border-1 bg-transparent text-dark"
                        name="Module"
                        id="Module"
                        value={formData ? formData.Module : ""}
                        onChange={handleChange}
                      >
                        <option value="">Select Module</option>
                        {Modules.map((Module) => (
                          <option key={Module} value={Module}>
                            {Module}
                          </option>
                        ))}
                      </select>
                      {errors.Module && (
                        <span className="text-danger">{errors.Module}</span>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="Coeff">Coeff</FormLabel>
                      <Input
                        type="text"
                        name="Coeff"
                        id="Coeff"
                        placeholder="Enter Coeff"
                        value={formData ? formData.Coeff : ""}
                        onChange={handleChange}
                      />
                      {errors.Coeff && (
                        <span className="text-danger">{errors.Coeff}</span>
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
            <div className="d-flex justify-content-center mt-3">
              <Pagination
                subjectsPerPage={subjectsPerPage}
                totalSubjects={subjects.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default TableCourses;
