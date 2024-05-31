import React, { useState, useEffect } from "react";
import { Card, CardHeader, Table, Container, Row, FormGroup, Input } from "reactstrap";
import axios from "axios";

const TeacherData = ({ teacherId }) => {
  const [teacherData, setTeacherData] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState({});

  useEffect(() => {
    if (teacherId) {
      const fetchTeacherData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/teachers/teacherProfile/teacherDataWithAbsences/${teacherId}`
          );
          console.log("Fetched teacher data:", response.data); // Debugging line
          if (response.data.success) {
            setTeacherData(response.data.data);
          } else {
            console.error("Failed to fetch teacher data");
          }
        } catch (error) {
          console.error("Error fetching teacher data:", error);
        }
      };
      fetchTeacherData();
    } else {
      setTeacherData(null);
    }
  }, [teacherId]);

  const handleClassChange = (subjectId, classId) => {
    setSelectedClasses((prev) => ({
      ...prev,
      [subjectId]: classId,
    }));
  };

  const getAbsenceCount = (subject) => {
    const selectedClassId = selectedClasses[subject.id];
    if (selectedClassId && selectedClassId !== "all") {
      const selectedClass = subject.classes.find((cls) => cls.id === selectedClassId);
      return selectedClass ? selectedClass.absences : 0;
    } else {
      return subject.totalAbsences;
    }
  };

  return (
    <Container className="mt--0" fluid>
      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0">
              <div className="row">
                <h1 className="col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center listEtudiant">
                  Liste des cours
                </h1>
              </div>
            </CardHeader>
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th scope="col">Subject</th>
                  <th scope="col">Classes</th>
                  <th scope="col">Absences</th>
                </tr>
              </thead>
              <tbody>
                {teacherData &&
                teacherData.subjects &&
                teacherData.subjects.length > 0 ? (
                  teacherData.subjects.map((subject) => (
                    <tr key={subject.id}>
                      <td>{subject.subjectName}</td>
                      <td>
                        <FormGroup>
                          <Input
                            type="select"
                            onChange={(e) => handleClassChange(subject.id, e.target.value)}
                          >
                            <option value="all">All Classes</option>
                            {subject.classes.map((cls) => (
                              <option key={cls.id} value={cls.id}>
                                {cls.className}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </td>
                      <td>{getAbsenceCount(subject)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center" }}>
                      No data found for the selected teacher
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default TeacherData;
