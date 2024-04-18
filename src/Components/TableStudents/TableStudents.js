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
import "./TableStudents.css";
import SelectOptions from "../SelectOptions/SelectOptions";
import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";

const TableStudents = () => {
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    _id: "",
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
  useEffect(() => {
    axios
      .get("http://localhost:5000/students")
      .then((response) => {
        setStudents(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching majors:", error);
      });
  }, [students]);

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
        console.error("Error fetching majors:", error);
      });
  }, []);

  const groups = ["1", "2", "3", "4"];

  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // State for add student modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleFilterChange = (major, level) => {
    setSelectedMajor(major);
    setSelectedLevel(level);
    const filteredData = students.filter(
      (student) =>
        (major === "" || student.major === major) &&
        (level === "" || student.level === level)
    );
  };

  const handleStudent = (action) => {
    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
    const cin = document.getElementById("cin").value;
    const email = document.getElementById("email").value;
    const birthday = new Date(document.getElementById("birthday").value)
      .toISOString()
      .split("T")[0];
    const major = document.getElementById("major").value;
    const year = parseInt(document.getElementById("year").value); // Convert level to integer
    const group = parseInt(document.getElementById("group").value); // Convert group to integer

    // Construct the new student object
    if (action === "add") {
      const newStudent = {
        FirstName: firstName,
        LastName: lastName,
        CIN: cin,
        Email: email,
        Birthday: birthday,
        Major: major,
        Year: year,
        Group: group,
      };
      console.log("newStudent:", newStudent);
      setStudents([...students, newStudent]); // Add new student to original data

      setModalOpen(false); // Close modal after adding
      // Send new student data to server

      axios
        .post("http://localhost:5000/students", newStudent)
        .then((response) => {
          console.log("Student added:", response.data);
        })
        .catch((error) => {
          console.error("Error in Adding student:", error);
        });
    } else if (action === "update") {
      const id = document.getElementById("id").value;

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
      console.log("newStudent:", newStudent);
      setStudents([...students, newStudent]); // Add new student to original data

      setUpdateModalOpen(!updateModalOpen);
      axios
        .put(`http://localhost:5000/students/${newStudent?._id}`, newStudent)
        .then((response) => {
          console.log("Student updated:", response.data);
        })
        .catch((error) => {
          console.error("Error in updating student:", error);
        });
    }
  };

  const handleDelete = (student) => {
    toggleDeleteModal();
    axios
      .delete(`http://localhost:5000/students/${student?._id}`)
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

  const toggleModal = () => setModalOpen(!modalOpen); // Toggle add student modal

  const toggleUpdateModal = (student) => {
    setUpdateModalOpen(!updateModalOpen);
    setSelectedStudent(student);
    setFormData(student);

    console.log("updateModalOpen:", updateModalOpen);
    console.log("formdata:", formData);
  };
  const handleViewProfil = (student) => {
    console.log("View Profil");
    navigate("/profile", { state: { selectedStudent: student } });
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
                    Add Student
                  </Button>
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
                      <FormLabel for="firstname">First Name</FormLabel>
                      <Input
                        type="text"
                        name="firstname"
                        id="firstname"
                        placeholder="Enter First Name"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="lastname">Last Name</FormLabel>
                      <Input
                        type="text"
                        name="lastname"
                        id="lastname"
                        placeholder="Enter Last Name"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="cin">Num CIN</FormLabel>
                      <Input
                        type="text"
                        name="cin"
                        id="cin"
                        placeholder="Enter CIN"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="email">Email</FormLabel>
                      <Input
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Enter Email"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="birthday">Birthday</FormLabel>
                      <Input
                        type="date"
                        name="birthday"
                        id="birthday"
                        placeholder="Enter Date of Birth"
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
                  students.map((student) => (
                    <tr key={student._id}>
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
                      <FormLabel for="firstname">First Name</FormLabel>
                      <input
                        type="text"
                        style={{ display: "none" }}
                        id="id"
                        value={formData ? formData._id : ""}
                      />

                      <Input
                        type="text"
                        name="FirstName"
                        id="firstname"
                        placeholder="Enter First Name"
                        value={formData ? formData.FirstName : ""}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="lastname">Last Name</FormLabel>
                      <Input
                        type="text"
                        name="LastName"
                        id="lastname"
                        placeholder="Enter Last Name"
                        value={formData ? formData.LastName : ""}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="cin">Num CIN</FormLabel>
                      <Input
                        type="text"
                        name="CIN"
                        id="cin"
                        placeholder="Enter CIN"
                        value={formData ? formData.CIN : ""}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="email">Email</FormLabel>
                      <Input
                        type="text"
                        name="Email"
                        id="email"
                        placeholder="Enter Email"
                        value={formData ? formData.Email : ""}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="birthday">Birthday</FormLabel>
                      <Input
                        type="date"
                        name="Birthday"
                        id="birthday"
                        placeholder="Enter Date of Birth"
                        value={formData ? formData.Birthday.slice(0, 10) : ""}
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
                      <FormLabel for="Level">Level</FormLabel>
                      <select
                        className="form-control shadow-none border-1 bg-transparent text-dark"
                        name="Year"
                        id="year"
                        value={formData ? formData.Year : ""}
                        onChange={handleChange}
                      >
                        <option value="">Select Level</option>
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
                    <p>Are you sure you want to delete this student?</p>
                  </ModalBody>
                  <div className="modal-footer">
                    <Button
                      className="addbtn"
                      onClick={() => {
                        handleDelete(selectedStudent);
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
