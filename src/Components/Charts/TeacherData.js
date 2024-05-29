import React, { useState, useEffect } from 'react';
import { Card, CardHeader, Table, Container, Row } from "reactstrap";
import axios from 'axios';

const TeacherData = ({ teacherId }) => {
    const [teacherData, setTeacherData] = useState(null);

    useEffect(() => {
        if (teacherId) {
            // Fetch the subjects and classes for the selected teacher
            const fetchTeacherData = async () => {
                try {
                    const response = await axios
                    .get(`http://localhost:5000/teachers/TeacherProfile/teacherData/${teacherId}`);
                    console.log('Fetched teacher data 20000000:', response.data); // Debugging line
                    if (response.data.success) {
                        setTeacherData(response.data.data);
                    } else {
                        console.error('Failed to fetch teacher data');
                    }
                } catch (error) {
                    console.error('Error fetching teacher data:', error);
                }
            };
            fetchTeacherData();
        } else {
            setTeacherData(null);
        }
    }, [teacherId]);

    return (
        <Container className="mt--0" fluid>
            <Row>
                <div className="col">
                    <Card className="shadow">
                        <CardHeader className="border-0">
                            <div className='row'>
                                <h1 className="col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center listEtudiant">Liste des cours</h1>
                            </div>
                        </CardHeader>
                        {/* Table Content */}
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Subject</th>
                                    <th scope="col">Classes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teacherData && teacherData.subjects && teacherData.subjects.length > 0 ? (
                                    teacherData.subjects.map((subject) => (
                                        <tr key={subject.id}>
                                            <td>{subject.subjectName}</td>
                                            <td>
                                                {subject.classes.map((cls, index) => (
                                                    <div key={index}>{cls}</div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} style={{ textAlign: 'center' }}>No data found for the selected teacher</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card>
                </div>
            </Row>
        </Container>
    );
}

export default TeacherData;
