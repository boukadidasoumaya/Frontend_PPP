export function LineChartwData() {
   // src/attendanceService.js
 async function fetchAttendanceData() {
    const response = await fetch('http://your-backend-url/api/attendance'); // Replace with your backend URL
    if (!response.ok) {
      throw new Error('Failed to fetch attendance data');
    }
    const data = await response.json();
    return data;
  }
  function calculateWeeklyAttendance(data) {
    const attendance = {};
  
    data.forEach(entry => {
      const { id, day, time, t } = entry;
      if (!attendance[id]) {
        attendance[id] = Array(7).fill(0);
      }
      const dayIndex = day - 1; // Assuming day is 1-7 (Mon-Sun)
      attendance[id][dayIndex]++;
    });
  
    return attendance;
  }

    return (
        <div>
            <Line data={data} />
        </div>
    )
}