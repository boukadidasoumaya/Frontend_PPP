import React, { useState } from 'react';
import { render } from 'react-dom';
import ReactTable from 'react-table';
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
  UncontrolledTooltip,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,

  Input,
  FormText,
} from "reactstrap";
import { FormLabel } from 'react-bootstrap';


import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import routes from "../../routes";
import NavBar from "../NavBar/NavBar";
// core components

const Tables = (props) => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Soumaya Boukadida', major: 'RT', level: '3' },
    { id: 2, name: 'Rim Jbeli', major: 'GL', level: '3' },
    // ... more student data
  ]);
  const majors = ['MPI', 'RT', 'GL','IIA','IMI','MASTER'];
  const levels = ['2', '3', '4', '5'];
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // State for add student modal

  const handleFilterChange = (major, level) => {
    setSelectedMajor(major);
    setSelectedLevel(level);
    const filteredData = students.filter(
      (student) =>
        (major === '' || student.major === major) &&
        (level === '' || student.level === level)
    );
    setFilteredStudents(filteredData);
  };

  const handleAddStudent = (newStudent) => {
    setStudents([...students, newStudent]); // Add new student to original data
    setModalOpen(false); // Close modal after adding
    handleFilterChange(selectedMajor, selectedLevel); // Re-filter based on selections
  };

  const toggleModal = () => setModalOpen(!modalOpen); // Toggle add student modal

  return (
    <>
      <Sidebar {...props} routes={routes} logo={{ innerLink: "/", imgSrc: require("../../assets/img/brand/insatlogo.png"), imgAlt: "..." }} />
      <div className="main-content">
        <NavBar {...props} />
        <Header />
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0 d-flex align-items-center ">
                  {/* Filter Dropdowns on Left */}
                  <div style={{ display: 'flex' }}>
                    <select value={selectedMajor} onChange={(e) => handleFilterChange(e.target.value, selectedLevel)}>
                      <option value="">Toutes les spécialités</option>
                      {majors.map((major) => (
                        <option key={major} value={major}>
                          {major}
                        </option>
                      ))}
                    </select>
                    <select value={selectedLevel} onChange={(e) => handleFilterChange(selectedMajor, e.target.value)}>
                      <option value="">Tous les niveaux</option>
                      {levels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Centered "Liste des étudiants" */}
                  <h3 className="flex-grow mx-2">Liste des étudiants</h3>
                  {/* Add Student Button in Center */}
                  <Button color="primary" onClick={toggleModal} className="mx-2">
                    Ajouter un étudiant
                  </Button>
                </CardHeader>
                {/* Table Content */}
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Nom</th>
                      <th scope="col">Spécialité</th>
                      <th scope="col">Niveau</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Display filtered students or message if none found */}
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6}>Aucun étudiant trouvé pour les filtres sélectionnés</td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>{student.major}</td>
                          <td>{student.level}</td>
                          <td>{/* ... action buttons or links ... */}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card>
            </div>
          </Row>
          {/* Add Student Modal */}
          <Modal isOpen={modalOpen} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Ajouter un étudiant</ModalHeader>
            <ModalBody>
              {/* ... form fields to capture student data ... */}
              <FormGroup>
                <FormLabel for="name">Nom</FormLabel>
                <Input type="text" name="name" id="name" placeholder="Entrez le nom de l'étudiant" />
              </FormGroup>
              <FormGroup>
                <FormLabel for="major">Spécialité</FormLabel>
                <select name="major" id="major">
                  <option value="">Sélectionnez une spécialité</option>
                  {majors.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup>
                <FormLabel for="level">Niveau</FormLabel>
                <select name="level" id="level">
                  <option value="">Sélectionnez un niveau</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </ModalBody>
            <Button color="primary" onClick={() => handleAddStudent({ name: "", major: "", level: "" })}>
              Ajouter
            </Button>
            <Button color="link text-muted" onClick={toggleModal}>
              Annuler
            </Button>
          </Modal>
        </Container>
      </div>
    </>
  );
  
};

export default Tables;
