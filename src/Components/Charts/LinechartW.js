import { ResponsiveLine } from '@nivo/line'
import  {dataW} from './dataW'
import React, { useEffect, useState } from 'react';
function LinechartW(data ) {
    async function fetchAttendanceData() {
        const response = await fetch('/api/attendance/attendance'); // Replace with your backend URL
        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }
        const dataw = await response.json();
        console.log(dataw);
        return dataw;
      }
      
      // Function to calculate weekly attendance from the fetched data
      function calculateWeeklyAttendance(data) {
        const attendance = {};
      
        data.forEach(entry => {
          const { id, day } = entry;
          if (!attendance[id]) {
            attendance[id] = Array(7).fill(0);
          }
          const dayIndex = day - 1; // Assuming day is 1-7 (Mon-Sun)
          attendance[id][dayIndex]++;
        });
      
        // Transform the attendance object into a format suitable for the ResponsiveLine component
        const lineData = Object.keys(attendance).map(id => ({
          id: id,
          data: attendance[id].map((count, index) => ({
            x: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index],
            y: count,
          })),
        }));
      
        return lineData;
      }
      
        const [attendanceData, setAttendanceData] = useState([]);
        const [error, setError] = useState(null);
      
        useEffect(() => {
          async function getAttendanceData() {
            try {
              const dataw = await fetchAttendanceData();
              setAttendanceData(dataw);
            } catch (error) {
              setError(error.message);
            }
          }
      
          getAttendanceData();
        }, []);
  return (
    <>
     <ResponsiveLine
        data={attendanceData}
        theme={{
          
            "text": {
                "fontSize": 11,
                "fill": "#64738C",
                "outlineWidth": 0,
                "outlineColor": "transparent"
            },
            "axis": {
                "domain": {
                    "line": {
                        "stroke": "#19204D",
                        "strokeWidth": 0
                    }
                },
                "legend": {
                    "text": {
                        "fontSize": 12,
                        "fill": "#C9C8C8",
                        "outlineWidth": 0,
                        "outlineColor": "transparent"
                    }
                },
                "ticks": {
                    "line": {
                        "stroke": "#64738C",
                        "strokeWidth": 1
                    },
                    "text": {
                        "fontSize": 11,
                        "fill": "#64738C",
                        "outlineWidth": 0,
                        "outlineColor": "#64738C",
                    }
                }
            },
            "grid": {
                "line": {
                    "stroke": "#DDDBDB",
                    "strokeWidth": 1
                }
            },
            "legends": {
                "title": {
                    "text": {
                        "fontSize": 11,
                        "fill": "#DDDBDB",
                        "outlineWidth": 0,
                        "outlineColor": "transparent"
                    }
                },
                "text": {
                    "fontSize": 11,
                    "fill": "##64738C",
                    "outlineWidth": 0,
                    "outlineColor": "transparent"
                },
                "ticks": {
                    "line": {},
                    "text": {
                        "fontSize": 10,
                        "fill": "##64738C",
                        "outlineWidth": 0,
                        "outlineColor": "transparent"
                    }
                }
            },
            
            
             
          
        }}
          margin={{ top: 5, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: true,
              reverse: false
          }}
          yFormat=" >-.2f"
          curve="natural"
          axisTop={null}
          axisRight={null}
          axisBottom={{
              tickSize: 0,
              tickPadding: 15,
              tickRotation: 0,
              legend: '',
              legendOffset: 36,
              legendPosition: 'middle',
              truncateTickAt: 0
          }}
          axisLeft={{
              tickSize: 0,
              tickPadding: 15,
              tickRotation: 0,
              legend: '',
              legendOffset: -40,
              legendPosition: 'middle',
              truncateTickAt: 0
          }}
          colors={['#5E72E4']}
  
          enableGridX={false}
          enableGridY={false}
          lineWidth={6}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          areaBaselineValue={20}
          enableTouchCrosshair={true}
          useMesh={true}
          legends={[]}
      />
      </>
    );
  }
export default LinechartW;