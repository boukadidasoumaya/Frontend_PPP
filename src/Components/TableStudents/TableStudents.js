
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
import "./TableStudents.css"

const TableStudents = () => {
    const [students, setStudents] = useState([
        { id: 1, name: 'Soumaya Boukadida', major: 'RT', level: '3' },
        { id: 2, name: 'Rim Jbeli', major: 'GL', level: '3' },
        { id: 3, name: 'Mabahej ben hassine', major: 'GL', level: '3' }
        // ... more student data
      ]);
      const majors = ['MPI', 'RT', 'GL','IIA','IMI','MASTER'];
      const levels = ['2', '3', '4', '5'];
      const [selectedMajor, setSelectedMajor] = useState('');
      const [selectedLevel, setSelectedLevel] = useState('');
      const [filteredStudents, setFilteredStudents] = useState([]);
      const [modalOpen, setModalOpen] = useState(false); // State for add student modal
      const [updateModalOpen, setUpdateModalOpen] = useState(false);
    
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
      
    
      const toggleUpdateModal = () => {
        setUpdateModalOpen(!updateModalOpen);
      };
    return (
        <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex align-items-center ">
                {/* Filter Dropdowns on Left */}
                <div className='col-lg-2 col-md-3 col-sm-2 d-flex major' >
                  
                  <select  className="form shadow-none border-1 bg-transparent text-dark" value={selectedMajor} onChange={(e) => handleFilterChange(e.target.value, selectedLevel)}>
                    <option value="">Major</option>
                    {majors.map((major) => (
                      <option key={major} value={major}>
                        {major}
                      </option>
                    ))}
                  </select>
                  <select className="form shadow-none border-1 bg-transparent text-dark" value={selectedLevel} onChange={(e) => handleFilterChange(selectedMajor, e.target.value)}>
                    <option value="">Level</option>
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Centered "Liste des étudiants" */}
                <h3 className="col-lg-7 col-md-7 col-sm-7 d-flex  justify-content-center listEtudiant ">Liste des étudiants</h3>
                {/* Add Student Button in Center */}
                <div className="col-lg-2 col-md-1 col-sm-2 d-flex   justify-content-end   mx-6 ">
                <Button color="primary" onClick={toggleModal} className=" mx2">
                  Ajouter un étudiant
                </Button>
                </div>
              </CardHeader>
              {/* Table Content */}
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Nom</th>
                    <th scope="col">Spécialité</th>
                    <th scope="col">Niveau</th>
                    <th scope="col">Group</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {/* Display filtered students or message if none found */}
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td  colSpan={6} style={{ textAlign: 'center' }}>Aucun étudiant trouvé pour les filtres sélectionnés</td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.major}</td>
                        <td>{student.level}</td>
                        <td>{/* ... action buttons or links ... */}</td>
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
                          href="#pablo"
                          onClick={toggleUpdateModal}
                        >
                          <i className="fas fa-pencil-alt" />
                         Update
                        </DropdownItem>
                         {/* Update Student Modal */}
                        <Modal isOpen={updateModalOpen} toggle={toggleUpdateModal}>
                          <ModalHeader toggle={toggleUpdateModal}>Modifier l'étudiant</ModalHeader>
                          <ModalBody>
                            {/* Form fields to capture updated student data */}
                            <FormGroup>
                              <FormLabel for="name">Nom</FormLabel>
                              <Input type="text" name="name" id="name" placeholder="Entrez le nom de l'étudiant" />
                            </FormGroup>
                            {/* Add other form fields for updating student data */}
                          </ModalBody>
                          <div className="modal-footer">
                            <Button color="primary" onClick={() => {}}>
                              Enregistrer les modifications
                            </Button>
                            <Button color="link" onClick={toggleUpdateModal}>
                              Annuler
                            </Button>
                          </div>
                        </Modal>
                        <DropdownItem
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
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
              <FormLabel >Num CIN</FormLabel>
              <Input type="text" name="name" id="name" placeholder="Entrez le numero CIN" />
              <FormLabel >Date de Naissance</FormLabel>
              <Input type="date" name="name" id="name" placeholder="Entrez la date de naissance" />
            </FormGroup>
            <FormGroup>
              <FormLabel for="major">Spécialité</FormLabel>
              <select className="form-control shadow-none border-1 bg-transparent text-dark"  name="major" id="major">
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
              <select className="form-control shadow-none border-1 bg-transparent text-dark" name="level" id="level">
                <option value="">Sélectionnez un niveau</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </FormGroup>
          </ModalBody>
          <div className="modal-footer">
          <Button className='' color="primary" onClick={() => handleAddStudent({ name: "", major: "", level: "" })}>
            Ajouter
          </Button>
          <Button color="link text-muted" onClick={toggleModal}>
            Annuler
          </Button>
          </div>
         
        </Modal>
      </Container>
    );
}

export default TableStudents;
