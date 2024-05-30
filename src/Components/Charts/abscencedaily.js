
function Absence () {
    async function calculateAbsencesForToday() {
      try {
        const response = await fetch('/api/attendance/abscence', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log(data.message);
      } catch (error) {
        console.error('Error calculating absences:', error);
      }
    }
  
    calculateAbsencesForToday();
    return (
      <div>
        <h1>Calculating absences for today...</h1>
      </div>
    );}
    export default Absence;