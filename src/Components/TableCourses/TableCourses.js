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
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
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
// import "./TableStudents.css";
import SelectOptions from "../SelectOptions/SelectOptions";
import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";

const TableStudents = () => {
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]); // Changed variable name from students to subjects
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
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/subjects")
      .then((response) => {
        setSubjects(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, [subjects]);

  const [majors, setMajors] = useState([]);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/classes/majors")
      .then((response) => {
        setMajors(response.data.majors);
        console.log("Majors fetched:", response.data.majors);
        console.log("Majors:", majors);
      })
      .catch((error) => {
        console.error("Error fetching majors:", error);
      });
  }, []);
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

  const groups = ["1", "2", "3", "4"];

  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // State for add student modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleFilterChange = (major, level) => {
    setSelectedMajor(major);
    setSelectedLevel(level);
    const filteredData = subjects.filter(
      (student) =>
        (major === "" || student.major === major) &&
        (level === "" || student.level === level)
    );
  };

  const handleStudent = (action) => {
    const subjectName = document.getElementById("SubjectName").value;
    const module = document.getElementById("Module").value;
    const coeff = document.getElementById("Coeff").value;
    const major = document.getElementById("major").value;
    const year = parseInt(document.getElementById("year").value); // Convert level to integer
    const group = parseInt(document.getElementById("group").value); // Convert group to integer

    // Construct the new student object
    if (action === "add") {
      const newSubject = {
        SubjectName: subjectName,
        coeff: module,
        Major: major,
        Year: year,
        Group: group,
      };
      console.log("newSubject:", newSubject);
      setSubjects([...subjects, newSubject]); // Add new student to original data

      setModalOpen(false); // Close modal after adding
      // Send new student data to server

      axios
        .post("http://localhost:5000/api/subjects", newSubject)
        .then((response) => {
          console.log("Subject added:", response.data);
        })
        .catch((error) => {
          console.error("Error in Adding subject:", error);
        });
    } else if (action === "update") {
      const id = document.getElementById("id").value;

      const newSubject = {
        _id: id,
        SubjectName: subjectName,
        Module: module,
        coeff: coeff,
        Major: major,
        Year: year,
        Group: group,
      };

      console.log("newSubject:", newSubject);
      setSubjects([...subjects, newSubject]); // Add new student to original data

      setUpdateModalOpen(!updateModalOpen);
      axios
        .put(`http://localhost:5000/api/subjects/${newSubject?._id}`, newSubject)
        .then((response) => {
          console.log("Subject updated:", response.data);
        })
        .catch((error) => {
          console.error("Error in updating subject:", error);
        });
    }
  };

  const handleDelete = (subject) => {
    toggleDeleteModal();
    axios
      .delete(`http://localhost:5000/api/subjects/${subject?._id}`)
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

  const toggleModal = () => setModalOpen(!modalOpen); // Toggle add student modal

  const toggleUpdateModal = (subject) => {
    setUpdateModalOpen(!updateModalOpen);
    setSelectedSubject(subject);
    setFormData(subject);

    console.log("updateModalOpen:", updateModalOpen);
    console.log("formdata:", formData);
  };
  const handleViewProfil = (subject) => {
    console.log("View Profil");
    navigate("/profile", { state: { selectedSubject: subject } });
  };

  return (
    <Container className="mt--7" fluid>
      {/* Table */}
      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0 ">
              <div className="row">
                <h1 className="col-lg-12 col-md-12 col-sm-12 d-flex  justify-content-center listEtudiant">
                  Liste des étudiants
                </h1>
              </div>
              {/* Filter Dropdowns on Left */}
              <div className="row">
                <div className="col-lg-3 col-md-2 col-sm-2 d-flex major">
                  <SelectOptions
                    options={majors.map((major) => ({
                      value: major,
                      label: major,
                    }))}
                    selectedValue={selectedMajor}
                    onOptionChange={(newMajor) =>
                      handleFilterChange(newMajor, selectedLevel)
                    }
                    placeholderText="Major"
                  />
                  <SelectOptions
                    options={levels.map((level) => ({
                      value: level,
                      label: level,
                    }))}
                    selectedValue={selectedLevel}
                    onOptionChange={(newLevel) =>
                      handleFilterChange(selectedMajor, newLevel)
                    }
                    placeholderText="Level"
                  />
                </div>
                {/* Centered "Liste des étudiants" */}

                {/* Add Student Button in Center */}
                <div className="col-lg-9 col-md-10 col-sm-10 d-flex AddEtudiant justify-content-end   ">
                  <Button className="addbtn" onClick={toggleModal}>
                    Add Subject
                  </Button>
                </div>
                {/* Add Student Modal */}
                <Modal
                  isOpen={modalOpen}
                  toggle={toggleModal}
                  innerRef={modalRef}
                >
                  <ModalHeader toggle={toggleModal}>Add Subject</ModalHeader>
                  <ModalBody>
                    <FormGroup>
                      <FormLabel for="SubjectName">Subject Name</FormLabel>
                      <Input
                        type="text"
                        name="SubjectName"
                        id="SubjectName"
                        placeholder="Enter Subject Name"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="Module">Module</FormLabel>
                      <Input
                        type="text"
                        name="Module"
                        id="Module"
                        placeholder="Enter Module"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="Coeff">Coefficient</FormLabel>
                      <Input
                        type="text"
                        name="Coeff"
                        id="Coeff"
                        placeholder="Enter Coefficient"
                      />
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
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="year">Year</FormLabel>
                      <select
                        className="form-control shadow-none border-1 bg-transparent text-dark"
                        name="year"
                        id="year"
                      >
                        <option value="">Select Year</option>
                        {levels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
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
                    </FormGroup>
                  </ModalBody>
                  <div className="modal-footer">
                    <Button
                      className="addbtn"
                      onClick={() => {
                        handleStudent("add");
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
                  <th scope="col">Coefficient</th>
                  <th scope="col">Major</th>
                  <th scope="col">Year</th>
                  <th scope="col">Group</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Afficher les étudiants ou un message s'il n'y en a aucun */}
                {subjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      No Subject found
                    </td>
                  </tr>
                ) : (
                  subjects.map((subject) => (
                    <tr key={subject._id}>
                      <td>{subject.SubjectName}</td>
                      <td>{subject.Module}</td>
                      <td>{subject.Coeff}</td>
                      <td>{subject.Major}</td>
                      <td>{subject.Year}</td>
                      <td>{subject.Group}</td>
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
                                handleViewProfil(subject);
                              }}
                            >
                              <i className="fa-solid fa-eye"></i>
                              View Profile
                            </DropdownItem>

                            <DropdownItem
                              href=""
                              onClick={() => {
                                toggleUpdateModal(subject);
                              }}
                            >
                              <i className="fas fa-pencil-alt" />
                              Update
                            </DropdownItem>
                            {/* Modal de mise à jour du sujet */}

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
                      <FormLabel for="SubjectName">Subject Name</FormLabel>
                      <input
                        type="text"
                        style={{ display: "none" }}
                        id="id"
                        value={formData ? formData._id : ""}
                      />

                      <Input
                        type="text"
                        name="SubjectName"
                        id="SubjectName"
                        placeholder="Enter Subject Name"
                        value={formData ? formData.SubjectName : ""}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="Module">Module</FormLabel>
                      <Input
                        type="text"
                        name="Module"
                        id="Module"
                        placeholder="Enter Module"
                        value={formData ? formData.Module : ""}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="Coeff">Coefficient</FormLabel>
                      <Input
                        type="text"
                        name="Coeff"
                        id="Coeff"
                        placeholder="Enter Coefficient"
                        value={formData ? formData.Coeff : ""}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="Major">Major</FormLabel>
                      <select
                        className="form-control shadow-none border-1 bg-transparent text-dark"
                        name="Major"
                        id="major"
                        value={formData ? formData.Major : ""}
                        onChange={handleChange}
                      >
                        <option value="">Select Major</option>
                        {majors.map((major) => (
                          <option key={major} value={major}>
                            {major}
                          </option>
                        ))}
                      </select>
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="Year">Year</FormLabel>
                      <select
                        className="form-control shadow-none border-1 bg-transparent text-dark"
                        name="Year"
                        id="year"
                        value={formData ? formData.Year : ""}
                        onChange={handleChange}
                      >
                        <option value="">Select Year</option>
                        {levels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="Group">Group</FormLabel>
                      <select
                        className="form-control shadow-none border-1 bg-transparent text-dark"
                        name="Group"
                        id="group"
                        value={formData ? formData.Group : ""}
                        onChange={handleChange}
                      >
                        <option value="">Select Group</option>
                        {groups.map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                      </select>
                    </FormGroup>
                  </ModalBody>
                  <div className="modal-footer">
                    <Button
                      className="addbtn"
                      onClick={() => {
                        handleStudent("update");
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
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default TableStudents;
