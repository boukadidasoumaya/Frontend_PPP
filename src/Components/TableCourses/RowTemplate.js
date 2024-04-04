import React, { useState } from 'react';
import { Container, Row, Card, CardHeader, Table, Button, Modal, ModalHeader, ModalBody, FormGroup, Input } from 'reactstrap';
import SelectOptions from '../SelectOptions/SelectOptions';

const RowTemplate = () => {
  const [students, setStudents] = useState([
    { major:'RT',semester:'1',module: 'Math 1', course: ['Analyse'], hours: '30',coefficiant: '3' },
    {  major:'GL',semester:'1',module: 'Math 1', course: ['Algèbre'], hours: '30',coefficiant: '3' },
    {  major:'IMI',semester:'1',module: 'Math 1', course: ['Probabilité'], hours: '30',coefficiant: '3' },
    {  major:'RT',semester:'1',module: 'Math 1', course: ['Statistique'], hours: '30',coefficiant: '3' },
    {  major:'IIA',semester:'2',module: 'Math 2', course: ['Analyse'], hours: '30',coefficiant: '3' },
    {  major:'RT',semester:'2',module: 'Math 2', course: ['Algèbre'], hours: '30',coefficiant: '3' },
    {  major:'RT',semester:'2',module: 'Math 2', course: ['Probabilité'], hours: '30',coefficiant: '3' },
    {  major:'RT',semester:'2',module: 'Math 2', course: ['Statistique'], hours: '30',coefficiant: '3' },
  ]);
  const semesters = ['1', '2'];
  const majors = ['RT', 'GL', 'IMI', 'IIA'];
  const modules = ['Math 1', 'Math 2', 'Math 3', 'Math 4'];
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFilterChange = (major, semester, module) => {
    setSelectedMajor(major);
    setSelectedSemester(semester);
    setSelectedModule(module);
    const filteredData = students.filter(student => 
      (major === '' || student.major === major) && 
      (semester === '' || student.semester === semester) && 
      (module === '' || student.module === module)
    );
    setFilteredStudents(filteredData);
  };

  const handleAddStudent = (newStudent) => {
    setStudents([...students, newStudent]);
    setModalOpen(false);
    handleFilterChange(selectedMajor, selectedSemester, selectedModule);
  };

  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <Container className="mt--7" fluid>
      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0">
              <div className="row">
                <h1 className="col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center listEtudiant">List of Courses</h1>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-2 col-sm-2 d-flex major">
                  <SelectOptions
                    options={majors.map(major => ({ value: major, label: major }))}
                    selectedValue={selectedMajor}
                    onOptionChange={major => handleFilterChange(major, selectedSemester, selectedModule)}
                    placeholderText="Majeure"
                  />
                
                  <SelectOptions
                    options={modules.map(module => ({ value: module, label: module }))}
                    selectedValue={selectedModule}
                    onOptionChange={module => handleFilterChange(selectedMajor, selectedSemester, module)}
                    placeholderText="Module"
                  />
                </div>
                <div className="col-lg-9 col-md-10 col-sm-10 d-flex AddEtudiant justify-content-end">
                  <Button onClick={toggleModal} className="addbtn">
                    Add Course
                  </Button>
                </div>
              </div>
            </CardHeader>
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th scope="col">Semestre</th>
                  <th scope="col">Module</th>
                  <th scope="col">Course</th>
                  <th scope="col">Hours</th>
                  <th scope="col">Coefficiant</th>
                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center' }}>Aucun étudiant trouvé avec les critères sélectionnés</td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={index}>
                      {index === 0 && <td rowSpan={filteredStudents.length}>{student.semester}</td>}
                      <td>{student.module}</td>
                      <td>{student.course.join(', ')}</td>
                      <td>{student.hours}</td>
                      <td>{student.coefficiant}</td>
                      <td className=""></td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>
        </div>
      </Row>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add course</ModalHeader>
        <ModalBody>
          <FormGroup>
        
            <Input type="text" name="course" id="course" placeholder="Cours" />
            <Input type="text" name="hours" id="hours" placeholder="Heures" />
            <Input type="text" name="coefficiant" id="coefficiant" placeholder="Coefficiant" />
          </FormGroup>
        </ModalBody>
        <div className="modal-footer">
          <Button color="primary" onClick={() => handleAddStudent({ major: selectedMajor, semester: selectedSemester, module: selectedModule })}>Ajouter</Button>
          <Button color="link text-muted" onClick={toggleModal}>Annuler</Button>
        </div>
      </Modal>
    </Container>
  );
};
export default RowTemplate;