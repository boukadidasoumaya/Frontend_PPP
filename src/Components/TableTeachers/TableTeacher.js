import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, Container, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Table, UncontrolledDropdown,DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './TableTeachers.css';
import SelectOptions from '../SelectOptions/SelectOptions';

const TableTeachers = () => {
    const [teachers, setTeachers] = useState([
        { id: 1, name: 'John Doe', cin: '0000', department: 'Computer Science', subject: 'Web Development', classes: '1', majors: 'RT' },
        { id: 2, name: 'Jane Smith', cin: '0001', department: 'Mathematics', subject: 'Algebra', classes: '2', majors: 'RT' },
        { id: 3, name: 'David Johnson', cin: '0002', department: 'Physics', subject: 'Quantum Mechanics', classes: '2', majors: 'GL' },
        // More teacher data
    ]);

    const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
    const specialites = ['Web Development', 'Algebra', 'Quantum Mechanics', 'Chemistry Lab', 'Biology Lab'];
    const majors = ['RT', 'GL', 'IIA', 'IMI', 'CH'];
    const classes = ['1', '2', '3', '4'];

    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [selectedSpecialite, setSelectedSpecialite] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');

    useEffect(() => {
        // Initialize filtered teachers with all teachers when component mounts
        setFilteredTeachers(teachers);
    }, []);

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
                                onOptionChange={(newSpecialite) => handleFilterChange(selectedSpecialite, selectedSpecialite)}
                                placeholderText="Specialite"
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
                            <th scope="col">Name</th>
                            <th scope="col">CIN</th>
                            <th scope="col">Department</th>
                            <th scope="col">Subject</th>
                            <th scope="col">Classes</th>
                            <th scope="col">Majors</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Display filtered teachers or message if none found */}
                        {filteredTeachers.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center' }}>No teacher found for the selected department</td>
                            </tr>
                        ) : (
                            filteredTeachers.map((teacher) => (
                                <tr key={teacher.id}>
                                    <td>{teacher.name}</td>
                                    <td>{teacher.cin}</td>
                                    <td>{teacher.department}</td>
                                    <td>{teacher.subject}</td>
                                    <td>
                                        {/* Display checkboxes for classes */}
                                        {classes.map((className) => (
                                            <div className="checkbox-container" key={className}>
                                                <Input type="checkbox" id={`class-${className}`} checked={teacher.classes.includes(className)} readOnly />
                                                <Label for={`class-${className}`}>{className}</Label>
                                                <span className="checkbox-custom"></span>
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        {/* Display checkboxes for majors */}
                                        {majors.map((major) => (
                                            <div className="checkbox-container" key={major}>
                                                <Input type="checkbox" id={`major-${major}`} checked={teacher.majors.includes(major)} readOnly />
                                                <Label for={`major-${major}`}>{major}</Label>
                                                <span className="checkbox-custom"></span>
                                            </div>
                                        ))}
                                    </td>
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
                                                <DropdownItem href="/profile">
                                                    <i className="fa-solid fa-eye"></i>
                                                    View Absence
                                                </DropdownItem>
                                                <DropdownItem href="" onClick={toggleUpdateModal}>
                                                    <i className="fas fa-pencil-alt" />
                                                    Update
                                                </DropdownItem>
                                                {/* Update Teacher Modal */}
                                                <DropdownItem href="" onClick={(e) => e.preventDefault()}>
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
                    </tbody>
                    
                </Table>
            </Card>
            {/* Add Teacher Modal */}
            <Modal isOpen={modalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Add a teacher</ModalHeader>
                <ModalBody>
                    {/* Form fields to capture teacher data */}
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" id="name" placeholder="Enter the teacher's name" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="department">Department</Label>
                        <Input type="text" name="department" id="department" placeholder="Enter the teacher's department" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="subject">Subject</Label>
                        <Input type="text" name="subject" id="subject" placeholder="Enter the subject taught by the teacher" />
                    </FormGroup>
                    <FormGroup>
                      <Label for="classes">Classes</Label>
                      {classes.map((className) => (
                        <div className="checkbox-container" key={className}>
                          <Input type="checkbox" name="classes" id={className} value={className} className="checkbox-input" />
                          <Label for={className} className="checkbox-label">{className}</Label>
                          <span className="checkbox-custom"></span>
                        </div>
                      ))}
                    </FormGroup>

                    <FormGroup>
                        <Label for="majors">Majors</Label>
                        {majors.map((major) => (
                            <div key={major}>
                                <Input type="checkbox" name="majors" id={major} value={major} />
                                <Label for={major}>{major}</Label>
                            </div>
                        ))}
                    </FormGroup>
                </ModalBody>
                <div className="modal-footer">
                    <Button color="primary" onClick={() => handleAddTeacher({ name: "", cin: "", department: "", subject: "", classes: "", majors: "" })}>
                        Add
                    </Button>
                    <Button color="link text-muted" onClick={toggleModal}>
                        Cancel
                    </Button>
                </div>
            </Modal>
        </Container>
    );
};

export default TableTeachers;
