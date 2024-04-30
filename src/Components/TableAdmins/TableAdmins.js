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
import "./TableAdmins.css";
import axios from "axios";
import { useRef } from "react";
import Pagination from "../Pagination/Pagination";

const TableAdmins = () => {
  const modalRef = useRef(null);
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    _id: "",
    username: "",
    password: "",
    cin: "",
    mail: "",
    num: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log("Updated formData:", formData);
  };

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // State for add admin modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/admin/`)
      .then((response) => {
        setAdmins(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching filtered admins:", error);
        setAdmins([]);
      });
  }, [admins]);

  const initialErrors = {
    username: "",
    password: "",
    cin: "",
    mail: "",
    num: "",
  };
  const [errors, setErrors] = useState(initialErrors);

  const clearErrors = () => {
    setErrors(initialErrors);
  };
  const handleAdmin = (action) => {
    // Récupération des valeurs des champs
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const cin = parseInt(document.getElementById("cin").value);
    const mail = document.getElementById("mail").value;
    const num = document.getElementById("num").value;

    const cinError = !cin
      ? "cin is required"
      : cin.toString().length !== 8
      ? "cin must be 1 digit long"
      : "";
    // Vérification si le cin contient uniquement des chiffres
    const cinFormatError = !/^\d+$/.test(cin)
      ? "cin must contain only digits"
      : "";

    const numFormatError = !/^\d+$/.test(num)
      ? "cin must contain only digits"
      : "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const UserFormatError = !/^[a-zA-Z0-9\séèàêâûîïô]+$/.test(username)
      ? "username must contain only letters and numbers"
      : "";

    // Combinaison des erreurs
    const newErrors = {
      username: !username ? "username is required" : UserFormatError,
      password: !password ? "password is required" : "",
      cin: cinError || cinFormatError,
      mail: !mail
        ? "mail is required"
        : emailRegex.test(mail)
        ? ""
        : "Invalid mail format",
      num: !num ? "num is required" : numFormatError,
    };

    // Mise à jour de l'état des erreurs
    console.log(newErrors);
    console.log("after new errrors username", username);
    setErrors(newErrors);
    console.log(errors);

    if (action === "add") {
      const newAdmin = {
        username: username,
        password: password,
        cin: cin,
        mail: mail,
        num: num,
      };

      // Send new admin data to server
      axios
        .post("http://localhost:5000/api/admin", newAdmin)
        .then((response) => {
          setAdmins([...admins, response.data.data]); // Add new admin to original data
          setModalOpen(false);
        })
        .catch((error) => {
          const backendErrors = error.response.data.errors;
          console.log("backend", error.response.data);
          setErrors((prevErrors) => ({ ...prevErrors, ...backendErrors }));
          console.log("backend errors", backendErrors);
          if (
            backendErrors &&
            backendErrors.username &&
            backendErrors.cin &&
            backendErrors.mail &&
            backendErrors.num
          ) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              combinedError: "Admin already exists",
            }));
          }
          console.log("errors", errors); // Close modal after adding
        });
    } else if (action === "update") {
      const id = document.getElementById("id").value;
      const newAdmin = {
        _id: id,
        username: username,
        password: password,
        cin: cin,
        mail: mail,
        num: num,
      };

      axios
        .put(`http://localhost:5000/api/admins/${newAdmin?._id}`, newAdmin)
        .then((response) => {
          console.log("Admin updated:", response.data);
          console.log("in if");
          setAdmins([...admins, newAdmin]); // Add new admin to original data
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

  const handleDelete = (admin) => {
    toggleDeleteModal();
    axios
      .delete(`http://localhost:5000/api/admin/${admin?._id}`)
      .then((response) => {
        console.log("Admin deleted:", response.data);
        setAdmins([...response.data]);
        console.log("admins:", admins);
      })
      .catch((error) => {
        console.error("Error in deleting admin:", error);
      });
  };

  const toggleDeleteModal = (admin) => {
    setDeleteModalOpen(!deleteModalOpen);
    setSelectedAdmin(admin);
  };

  const toggleModal = () => {
    clearErrors(); // Effacer les erreurs lors de la fermeture

    setModalOpen(!modalOpen);
  }; // Toggle add admin modal

  const toggleUpdateModal = (admin) => {
    clearErrors(); // Effacer les erreurs lors de la fermeture
    setUpdateModalOpen(!updateModalOpen);
    setSelectedAdmin(admin);
    setFormData(admin);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(10); // Nombre de admins par page;

  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt--7" fluid>
      {/* Table */}
      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0 ">
              <div className="col-lg-12 col-md-12 col-sm-12 d-flex  justify-content-center listAdmins">
                <h1>Liste des admins</h1>
              </div>

              {/* Centered "Liste des admins" */}

              {/* Add Admin Button in Center */}
              <div className="col-lg-9 col-md-10 col-sm-10 d-flex AddAdmin justify-content-end   ">
                <Button className="addbtn" onClick={toggleModal}>
                  Add Admin
                </Button>
              </div>
              {/* Add Admin Modal */}
              <Modal
                isOpen={modalOpen}
                toggle={toggleModal}
                innerRef={modalRef}
              >
                <ModalHeader toggle={toggleModal}>Add Admin</ModalHeader>
                <ModalBody>
                  <FormGroup>
                    <FormLabel for="username">UserName</FormLabel>
                    <Input
                      type="text"
                      name="username"
                      id="username"
                      placeholder="Enter UserName"
                    />
                    {errors.username && (
                      <span className="text-danger">{errors.username}</span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <FormLabel for="password">Password</FormLabel>
                    <Input
                      type="text"
                      name="password"
                      id="password"
                      placeholder="Enter passwordName"
                    />
                    {errors.password && (
                      <span className="text-danger">{errors.password}</span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <FormLabel for="cin">cin</FormLabel>
                    <Input
                      type="text"
                      name="cin"
                      id="cin"
                      placeholder="Enter cin"
                    />
                    {errors.cin && (
                      <span className="text-danger">{errors.cin}</span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <FormLabel for="mail">mail</FormLabel>
                    <Input
                      type="mail"
                      name="mail"
                      id="mail"
                      placeholder="Enter mail"
                    />
                    {errors.mail && (
                      <span className="text-danger">{errors.mail}</span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <FormLabel for="num">num</FormLabel>
                    <Input
                      type="text"
                      name="num"
                      id="num"
                      placeholder="Enter num"
                    />
                    {errors.num && (
                      <span className="text-danger">{errors.num}</span>
                    )}
                  </FormGroup>
                </ModalBody>
                <div className="modal-footer">
                  <Button
                    className="addbtn"
                    onClick={() => {
                      handleAdmin("add");
                    }}
                  >
                    Add Admin
                  </Button>
                  <Button color="link text-muted" onClick={toggleModal}>
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
                  <th scope="col">Username</th>
                  <th scope="col">cin</th>
                  <th scope="col">Email</th>
                  <th scope="col">Number</th>
                  <th scope="col">Actions </th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      No Admin found
                    </td>
                  </tr>
                ) : (
                  currentAdmins.map((admin) => (
                    <tr key={admin._id}>
                      <td>{admin.username}</td>
                      <td>{admin.cin}</td>
                      <td>{admin.mail}</td>
                      <td>{admin.num}</td>
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
                                toggleUpdateModal(admin);
                              }}
                            >
                              <i className="fas fa-pencil-alt" />
                              Update
                            </DropdownItem>
                            {/* Modal de mise à jour de l'admin*/}

                            <DropdownItem
                              href=""
                              onClick={() => {
                                toggleDeleteModal(admin);
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
                  toggle={() => toggleUpdateModal(selectedAdmin)}
                >
                  <ModalHeader toggle={() => toggleUpdateModal(null)}>
                    Modify Admin
                  </ModalHeader>
                  <ModalBody>
                    {/* Form fields to capture updated admin data */}
                    <FormGroup>
                      <FormLabel for="username">Username</FormLabel>
                      <Input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter Username"
                        value={formData ? formData.username : ""}
                        onChange={handleChange}
                      />
                      {errors.username && (
                        <span className="text-danger">{errors.username}</span>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="password">Password</FormLabel>
                      <Input
                        type="text"
                        name="password"
                        id="password"
                        placeholder="Enter passwordname"
                        value={formData ? formData.password : ""}
                        onChange={handleChange}
                      />
                      {errors.password && (
                        <span className="text-danger">{errors.password}</span>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="cin">cin</FormLabel>
                      <Input
                        type="text"
                        name="cin"
                        id="cin"
                        placeholder="Enter cin"
                        value={formData ? formData.cin : ""}
                        onChange={handleChange}
                      />
                      {errors.cin && (
                        <span className="text-danger">{errors.cin}</span>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="mail">Email</FormLabel>
                      <Input
                        type="mail"
                        name="mail"
                        id="mail"
                        placeholder="Enter mail"
                        value={formData ? formData.mail : ""}
                        onChange={handleChange}
                      />
                      {errors.mail && (
                        <span className="text-danger">{errors.mail}</span>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <FormLabel for="num">Number</FormLabel>
                      <Input
                        type="text"
                        name="num"
                        id="num"
                        placeholder="Enter number"
                        value={formData ? formData.num : ""}
                        onChange={handleChange}
                      />
                      {errors.num && (
                        <span className="text-danger">{errors.num}</span>
                      )}
                    </FormGroup>
                  </ModalBody>
                  <div className="modal-footer">
                    <Button
                      className="addbtn"
                      onClick={() => {
                        handleAdmin("update");
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
                    <p>Are you sure you want to delete this admin?</p>
                  </ModalBody>
                  <div className="modal-footer">
                    <Button
                      className="addbtn"
                      onClick={() => {
                        handleDelete(selectedAdmin);
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
                adminsPerPage={adminsPerPage}
                totalAdmins={admins.length}
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

export default TableAdmins;
