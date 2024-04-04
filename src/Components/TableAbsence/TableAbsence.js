import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
} from "reactstrap";
import SelectOptions from '../SelectOptions/SelectOptions';

const TableAbsence = () => {
    const [myCourses, setMyCourses] = useState([
        { id: 1, course: 'Analyse', module: 'Mathématique', numberOfAbsence: '3' },
        { id: 2, course: 'Programmation', module: 'Informatique', numberOfAbsence: '3' },
        { id: 3, course: 'Réseau', module: 'Réseau', numberOfAbsence: '3' },
        { id: 4, course: 'Base de données', module: 'Informatique', numberOfAbsence: '3' },
        // ... more course data
    ]);
    const [selectedCourse, setSelectedCourse] = useState(''); // State for selected course filter
    
    const handleFilterChange = (course) => {
        setSelectedCourse(course);
    };
    
    // Function to filter courses based on selected course
    const filterCourses = (course) => {
        return myCourses.filter(course => course.course === selectedCourse);
    };
    
    // Filtered list of courses based on selected course
    const filteredCourses = selectedCourse ? filterCourses(selectedCourse) : myCourses;
    
    return (
        <Container className="mt--0" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className='row'>
                <h1 className="col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center listEtudiant">Liste des cours</h1>
                </div>
                {/* Filter Dropdowns on Left */}
               <div className='row'>
                 <div className='col-lg-3 col-md-2 col-sm-2 d-flex major' >
                 <SelectOptions
                    options={['Analyse','Programmation','Réseau','Java'].map((course) => ({ value: course, label: course }))}
                    selectedValue={selectedCourse}
                    onOptionChange={(newCourse) => handleFilterChange(newCourse)}
                    placeholderText="Course"
                  />
                 </div>
               </div>
              </CardHeader>
              {/* Table Content */}
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Course</th>
                    <th scope="col">Module</th>
                    <th scope="col">Number Of Absence</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Display filtered courses or message if none found */}
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td  colSpan={6} style={{ textAlign: 'center' }}>No Absence found for the selected course</td>
                    </tr>
                  ) : (
                    filteredCourses.map((course) => (
                      <tr key={course.id}>
                        <td>{course.course}</td>
                        <td>{course.module}</td>
                        <td>{course.numberOfAbsence}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    );
}

export default TableAbsence;
