// TableTeachers.js
import React, { useState } from 'react';
import { Button, Card, CardHeader, Container, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, Modal, ModalBody, ModalHeader, Table, UncontrolledDropdown } from 'reactstrap';
import { FormLabel } from 'react-bootstrap';
import './TableTeachers.css';
import SelectOptions from '../SelectOptions/SelectOptions';
const TableTeachers = () => {
    const [teachers, setTeachers] = useState([
        { id: 1, name: 'John Doe', department: 'Computer Science', subject: 'Web Development' },
        { id: 2, name: 'Jane Smith', department: 'Mathematics', subject: 'Algebra' },
        { id: 3, name: 'David Johnson', department: 'Physics', subject: 'Quantum Mechanics' },
        // More teacher data
      ]);
    
      const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
      const specialites = ['Spécialité 1', 'Spécialité 2', 'Spécialité 3'];

      const [selectedDepartment, setSelectedDepartment] = useState('');
      const [filteredTeachers, setFilteredTeachers] = useState([]);
      const [selectedSpecialite, setSelectedSpecialite] = useState('');
      const [selectedLevel, setSelectedLevel] = useState('');

      const [modalOpen, setModalOpen] = useState(false);
      const [updateModalOpen, setUpdateModalOpen] = useState(false);
      const [selectedSubject, setSelectedSubject] = useState('');
    
      const handleFilterChange = (department, subject) => {
        setSelectedDepartment(department);
        setSelectedSubject(subject);
        const filteredData = teachers.filter(
          (teacher) =>
            (department === '' || teacher.department === department) &&
            (subject === '' || teacher.subject === subject)
        );
        setFilteredTeachers(filteredData);
      };
    
      const handleAddTeacher = (newTeacher) => {
        setTeachers([...teachers, newTeacher]);
        setModalOpen(false);
        handleFilterChange(selectedDepartment, selectedSubject);
      };
    
      const toggleModal = () => setModalOpen(!modalOpen);
    
      const toggleUpdateModal = () => setUpdateModalOpen(!updateModalOpen);

  return (
    <Container className="mt--7" fluid>
      {/* Table */}
      <Card className="shadow">
        <CardHeader className="border-0">
          {/* Filter Dropdowns on Left */}
          <div className='row'>
          <h1 className="col-12 d-flex justify-content-center listEnseignant">List of Professors</h1>

          </div>
          <div className='row'>
           
             <div className='col-lg-3 col-md-4 col-sm-2 d-flex filter' >
                   
                   <SelectOptions
                      options={departments.map((department) => ({ value: department, label: department }))}
                      selectedValue={selectedDepartment}
                      onOptionChange={(newDepartment) => handleFilterChange(newDepartment, selectedDepartment)}
                      placeholderText="Department"
                    />
                    <SelectOptions
                      options={specialites.map((specialite) => ({ value: specialite, label: specialite }))}
                      selectedValue={selectedSpecialite}
                      onOptionChange={(newSpecialite) => handleFilterChange(selectedSpecialite,selectedSpecialite)}
                       placeholderText="Specialite"
                    />
                   </div>

            {/* Centered "Liste des enseignants" */}
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
              <th scope="col">Nom</th>
              <th scope="col">Département</th>
              <th scope="col">Matière</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Display filtered teachers or message if none found */}
            {filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>Aucun enseignant trouvé pour le département sélectionné</td>
              </tr>
            ) : (
              filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.department}</td>
                  <td>{teacher.subject}</td>
                  
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
                            href="/profile"
                          >
                           <i class="fa-solid fa-eye"></i>
                          View Absence
                          </DropdownItem>
                    
                        <DropdownItem
                          href=""
                          onClick={toggleUpdateModal}
                        >
                          <i className="fas fa-pencil-alt" />
                         Update
                        </DropdownItem>
                        
                         {/* Update Student Modal */}

                        <DropdownItem
                          href=""
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className="fas fa-trash" />
                          Delete
                        </DropdownItem>
                        <Modal isOpen={updateModalOpen} toggle={toggleUpdateModal}>
    <ModalHeader toggle={toggleUpdateModal}>Modifier l'enseignant</ModalHeader>
    <ModalBody>
        {/* Form fields to capture updated teacher data */}
        <FormGroup>
            <FormLabel for="name">Nom</FormLabel>
            <Input type="text" name="name" id="name" placeholder="Entrez le nom de l'enseignant" />
        </FormGroup>
        <FormGroup>
            <FormLabel for="department">Département</FormLabel>
            <select className="form-control shadow-none border-1 bg-transparent text-dark" name="department" id="department">
                <option value="">Sélectionnez un département</option>
                {departments.map((department) => (
                    <option key={department} value={department}>
                        {department}
                    </option>
                ))}
            </select>
        </FormGroup>
        <FormGroup>
            <FormLabel for="subject">Matière</FormLabel>
            <Input type="text" name="subject" id="subject" placeholder="Entrez la matière enseignée" />
        </FormGroup>
        
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
<Modal isOpen={modalOpen} toggle={toggleModal}>
    <ModalHeader toggle={toggleModal}>Ajouter un enseignant</ModalHeader>
    <ModalBody>
        {/* Form fields to capture teacher data */}
        <FormGroup>
            <FormLabel for="name">Nom</FormLabel>
            <Input type="text" name="name" id="name" placeholder="Entrez le nom de l'enseignant" />
        </FormGroup>
        <FormGroup>
            <FormLabel for="department">Département</FormLabel>
            <select className="form-control shadow-none border-1 bg-transparent text-dark" name="department" id="department">
                <option value="">Sélectionnez un département</option>
                {departments.map((department) => (
                    <option key={department} value={department}>
                        {department}
                    </option>
                ))}
            </select>
        </FormGroup>
        <FormGroup>
            <FormLabel for="subject">Matière</FormLabel>
            <Input type="text" name="subject" id="subject" placeholder="Entrez la matière enseignée" />
        </FormGroup>
    </ModalBody>
    <div className="modal-footer">
        <Button color="primary" onClick={() => handleAddTeacher({ name: "", department: "", subject: "" })}>
            Ajouter
        </Button>
        <Button color="link text-muted" onClick={toggleModal}>
            Annuler
        </Button>
    </div>
</Modal>

                    
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </td>
                  
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
      {/* Add Teacher Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Ajouter un enseignant</ModalHeader>
        <ModalBody>
          {/* Form fields to capture teacher data */}
          <FormGroup>
            <FormLabel for="name">Nom</FormLabel>
            <Input type="text" name="name" id="name" placeholder="Entrez le nom de l'enseignant" />
          </FormGroup>
          <FormGroup>
            <FormLabel for="department">Département</FormLabel>
            <select className="form-control shadow-none border-1 bg-transparent text-dark" name="department" id="department">
              <option value="">Sélectionnez un département</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup>
            <FormLabel for="subject">Matière</FormLabel>
            <Input type="text" name="subject" id="subject" placeholder="Entrez la matière enseignée" />
          </FormGroup>
        </ModalBody>
        <div className="modal-footer">
          <Button color="primary" onClick={() => handleAddTeacher({ name: "", department: "", subject: "" })}>
            Ajouter
          </Button>
          <Button color="link text-muted" onClick={toggleModal}>
            Annuler
          </Button>
        </div>
      </Modal>
    </Container>
  );
};

export default TableTeachers;
