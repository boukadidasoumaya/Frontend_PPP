import React, { useState, useEffect } from "react";
import {Table} from "reactstrap";
import axios from "axios";

const TimeTableTest = () => {
  const token = sessionStorage.getItem('jwtToken');

  const [timeTables, setTimeTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const config = {
    headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
    },
};
  useEffect(() => {
    // Fetch all time tables from the server
    axios
      .get("http://localhost:5000/timetables",config)
      .then((response) => {
        setTimeTables(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching time tables:", error);
        setLoading(false);
      });
  }, [timeTables]);


  return (
    <div>
      <h1>Time Tables</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th scope="col">Start Time</th>
              <th scope="col">End Time</th>
              <th scope="col">Day</th>
              <th scope="col">Subject ID</th>
              <th scope="col">Class ID</th>
              <th scope="col">Teacher ID</th>
              <th scope="col">Room</th>
              <th scope="col">Week</th>
            </tr>
          </thead>
          <tbody>
            {timeTables.length === 0 ? (
              <tr>
                <td colSpan="8">No time tables found</td>
              </tr>
            ) : (
              timeTables.map((timeTable) => (
                <tr key={timeTable._id}>
                  <td>{timeTable.StartTime}</td>
                  <td>{timeTable.EndTime}</td>
                  <td>{timeTable.Day}</td>
                  <td>{timeTable.subject_id}</td>
                  <td>{timeTable.class_id}</td>
                  <td>{timeTable.teacher_id}</td>
                  <td>{timeTable.Room}</td>
                  <td>{timeTable.Week}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
      ;
    </div>
  );
};

export default TimeTableTest;
