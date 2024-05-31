import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
} from "reactstrap";
import SelectOptions from '../SelectOptions/SelectOptions';

const TableAbsence = ({id}) => {
    const [myCourses, setMyCourses] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(''); // State for selected course filter
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to manage errors
    const studentId = id; 
    useEffect(() => {
      const fetchData = async () => {
          try {
              let selectedSemesterValue = selectedSemester;
              if (selectedSemester === 'Semester 1') {
                  selectedSemesterValue = '1';
              } else if (selectedSemester === 'Semester 2') {
                  selectedSemesterValue = '2';
              }
            
              const endpoint = !selectedSemester || selectedSemester === 'All Year'
                  ? `http://localhost:5000/students/absences/${studentId}`
                  : `http://localhost:5000/students/absences/${studentId}/${selectedSemesterValue}`;
              
              const response = await axios.get(endpoint).then((response) => {
            
                setMyCourses(response.data.data);

                setLoading(false);
            })
            .catch((error) => {
              
                setMyCourses([]);
            });
  
             
          } catch (err) {
              setError('Failed to fetch data');
              setLoading(false);
          }
      };
      
      fetchData()
    
  }, [selectedSemester, myCourses]);
  

    const handleFilterChange = (semester) => {
        setSelectedSemester(semester);
    };


    return (
        <Container className="mt--0" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className='row'>
                <h1 className="col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center listEtudiant">List of Subjects</h1>
                </div>
                {/* Filter Dropdowns on Left */}
               <div className='row'>
                 <div className='col-lg-3 col-md-2 col-sm-2 d-flex major' >
                 <SelectOptions
                    options={['Semester 1','Semester 2','All Year'].map((course) => ({ value: course, label: course }))}
                    selectedValue={selectedSemester}
                    onOptionChange={handleFilterChange}
                    placeholderText="Semester"
                  />
                 </div>
               </div>
              </CardHeader>
              {/* Table Content */}
              {loading ? (
                  <div>Loading...</div>
              ) : error ? (
                  <div>{error}</div>
              ) : (
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
                  {myCourses.length === 0 ? (
                    <tr>
                      <td  colSpan={6} style={{ textAlign: 'center' }}>No Absence found for the selected semester</td>
                    </tr>
                  ) : (
                    myCourses.map((course) => (
                      <tr key={course.id}>
                        <td>{course.SubjectName}</td>
                        <td>{course.Module}</td>
                        <td>{course.count}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
              )}
            </Card>
          </div>
        </Row>
      </Container>
    );
}

export default TableAbsence;
