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
import SelectOptions from "../SelectOptions/SelectOptionsForCourses";
import { Alert } from "reactstrap";
import axios from "axios";
import { useRef } from "react";
import Pagination from "../Pagination/Pagination";
const token = sessionStorage.getItem("jwtToken");
const config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};
const config1 = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  },
};
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
    console.log("Updated formData:", formData);
  };

  const [Modules, setModules] = useState([]);
  const [majors, setMajors] = useState([]);
  const [levels, setLevels] = useState([]);
  const modules = formData.Module;

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/subjects/modules", config)
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
      .get("http://localhost:5000/classes/majors", config)
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
      .get("http://localhost:5000/classes/levels", config)
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
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false); // State for add subject modal
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
      .get(endpoint, config)
      .then((response) => {
        setSubjects(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching filtered subjects:", error);
        setSubjects([]);
      });
  }, [selectedModule, selectedMajor, selectedLevel]);

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
        .post("http://localhost:5000/api/subjects", newSubject, config)
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
      console.log("iiiiiiiiiiiiiiiiiid", id);
      const newSubject = {
        _id: id,
        SubjectName: SubjectName,
        Module: Module,
        Coeff: Coeff,
      };
console.log('newSubject')
      axios
        .put(
          `http://localhost:5000/api/subjects/${newSubject?._id}`,
          newSubject,
          config
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

  //upload
  const [Alertvisible, setAlertVisible] = useState(false);
  const [Successvisible, setSuccessVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [UploadErrors, setUploadErrors] = useState([]);

  const parseErrors = (errorArray) => {
    const errors = [];
    const messages = [];
    let jsoon = false;

    errorArray.forEach((errorString) => {
      if (/Duplicate/.test(errorString)) {
        jsoon = true;
        try {
          const jsonString = errorString
            .replace("Duplicate entry found: ", "")
            .trim();
          const parsedError = JSON.parse(jsonString);
          errors.push(parsedError);
          messages.push("Duplicate entry found: ");
        } catch (e) {
          console.error("Failed to parse error entry:", errorString);
        }
      } else if (/Missing/.test(errorString)) {
        jsoon = true;
        try {
          const jsonString = errorString
            .replace("Missing required fields in entry: ", "")
            .trim();
          const parsedError = JSON.parse(jsonString);
          errors.push(parsedError);
          messages.push("Missing required fields in entry: ");
        } catch (e) {
          console.error("Failed to parse error entry:", errorString);
        }
      } else if (/Coefficient/.test(errorString)) {
        jsoon = true;
        try {
          const jsonString = errorString
            .replace("Coefficient must be between 1 and 9 in entry: ", "")
            .trim();
          const parsedError = JSON.parse(jsonString);
          errors.push(parsedError);
          messages.push("Coefficient must be between 1 and 9 in entry: ");
        } catch (e) {
          console.error("Failed to parse error entry:", errorString);
        }
      } else if (/Champs/.test(errorString)) {
        jsoon = true;
        try {
          const jsonString = errorString
            .replace("Champs requis manquants dans l'entrée: ", "")
            .trim();
          const parsedError = JSON.parse(jsonString);
          errors.push(parsedError);
          messages.push("Champs requis manquants dans l'entrée: ");
        } catch (e) {
          console.error("Failed to parse error entry:", errorString);
        }
      } else {
        errors.push(errorString);
      }
    });

    return { errors, messages, jsoon };
  };

  const formatErrors = (errorString) => {
    const { errors, messages, jsoon } = errorString;
    if (!jsoon) {
      return (
        <div className="error-message">
          <p>{errors}</p>
        </div>
      );
    }
    // Render the error list
    return (
      <div>
        {errors.map((error, z) => (
          <React.Fragment key={z}>
            <div className="error-message">
              <p>{messages[z]}</p>
              <p>
                <strong>Subject Name:</strong> {error.SubjectName}
              </p>
              <p>
                <strong>Module:</strong> {error.Module}
              </p>
              <p>
                <strong>Coefficient:</strong> {error.Coeff}
              </p>
            </div>
            <br /> {/* Add a line break between each error */}
          </React.Fragment>
        ))}
      </div>
    );
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
        .post("http://localhost:5000/api/subjects/upload", formdata, config1)
        .then((response) => {
          console.log("File uploaded");
          // Handle success response
          setUploadModalOpen(false);
          setSuccessVisible(!Successvisible);
          setSelectedFile(null);
        })
        .catch((error) => {
          console.error("Errors in uploading file:", error);
          setUploadModalOpen(true); // Show the modal with errors
          setUploadErrors(error.response.data.error); // Assuming error.response.data.errors contains the error messages
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
  const onDismisssuccess = () => setSuccessVisible(!Successvisible);
  const toggleUploadModal = () => setUploadModalOpen(!uploadModalOpen);

  const handleDelete = (subject) => {
    toggleDeleteModal();
    axios
      .delete(`http://localhost:5000/api/subjects/${subject?._id}`, config)
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

  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const handleDrop = () => {
    axios
      .delete(
        `http://localhost:5000/api/subjects/drop/${selectedMajor}/${selectedLevel}`,
        config
      )
      .then((response) => {
        console.log(
          "All subjects with the sepecified critiria deleted:",
          response.data
        );
        setSubjects([]);
      })
      .catch((error) => {
        console.error("Error in deleting subjects:", error);
      });
    toggleDropModal();
  };

  const toggleDropModal = () => {
    setIsDropModalOpen(!isDropModalOpen);
  };

  const onDropClick = () => {
    toggleDropModal();
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [subjectsPerPage] = useState(10); // Nombre de matières par page;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = subjects.slice(
    indexOfFirstSubject,
    indexOfLastSubject
  );

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
        {Successvisible && (
          <div className="col  d-flex justify-content-end">
            <Alert
              isOpen={Successvisible}
              color="success"
              toggle={onDismisssuccess}
              className=""
            >
              File Uploaded successfully
            </Alert>
          </div>
        )}
      </Row>
      <Modal isOpen={uploadModalOpen} toggle={toggleUploadModal}>
        <ModalHeader color="danger" toggle={toggleUploadModal}>
          Notification for upload:
        </ModalHeader>
        <ModalBody>
          <div>
            <p>{formatErrors(parseErrors(UploadErrors))}</p>
          </div>
        </ModalBody>
      </Modal>
      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0 ">
              <div className="col-lg-12 col-md-12 col-sm-12 d-flex  justify-content-center listSubjects">
                <h1>Liste des matières</h1>
              </div>
              {/* Filter Dropdowns on Left */}
              <div className="row">
                <SelectOptions
                  options={ModuleOptions}
                  selectedValue={selectedModule}
                  onOptionChange={(newModule) =>
                    handleFilterChange(newModule, selectedMajor, selectedLevel)
                  }
                  placeholderText="Modules"
                />
                <SelectOptions
                  options={majorOptions}
                  selectedValue={selectedMajor}
                  onOptionChange={(newMajor) =>
                    handleFilterChange(selectedModule, newMajor, selectedLevel)
                  }
                  placeholderText="Majors"
                />
                <SelectOptions
                  options={levelOptions}
                  selectedValue={selectedLevel}
                  onOptionChange={(newLevel) =>
                    handleFilterChange(selectedModule, selectedMajor, newLevel)
                  }
                  placeholderText="Levels"
                />
              </div>
              {/* Centered "Liste des matières" */}

              {/* Add Subject Button in Center */}
              <div className="col-lg-12 col-md-12 col-sm-12 d-flex AddEtudiant justify-content-end   ">
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
                  <Button className="addbtn" onClick={toggleModal}>
                    Add Subject
                  </Button>
                </div>
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
                      <span className="text-danger">{errors.SubjectName}</span>
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
                  <Button color="link" onClick={toggleModal}>
                    Cancel
                  </Button>
                  {errors.combinedError && (
                    <span className="text-danger">{errors.combinedError}</span>
                  )}
                </div>
              </Modal>
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
                    <Button color="link" onClick={toggleUpdateModal}>
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
              <>
                <div className="d-flex justify-content-center mt-3">
                  <Pagination
                    itemsPerPage={subjectsPerPage}
                    totalItems={subjects.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                </div>
                {selectedMajor && selectedLevel && (
                  <div className="col-12 d-flex justify-content-end">
                    <button onClick={() => onDropClick()} class="delete-button">
                      <svg class="delete-svgIcon" viewBox="0 0 448 512">
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                      </svg>
                    </button>
                  </div>
                )}
                <Modal isOpen={isDropModalOpen} toggle={toggleDropModal}>
                  <ModalHeader toggle={toggleDropModal}>
                    Confirm Deletion
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      Are you sure you want to delete the subjects of{" "}
                      {selectedMajor} {selectedLevel}?
                    </p>
                    <Button color="danger" onClick={handleDrop}>
                      Delete
                    </Button>
                    <Button color="secondary" onClick={toggleDropModal}>
                      Cancel
                    </Button>
                  </ModalBody>
                </Modal>
              </>
            )}
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default TableCourses;
