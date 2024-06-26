import { ResponsivePie } from '@nivo/pie'
import React, { useEffect, useState } from 'react';
import { set } from 'react-hook-form';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
function PieChart(){
        const [pieData, setPieData] = useState([]);
    
        useEffect(() => {
            async function fetchData() {
                const token = sessionStorage.getItem('jwtToken');

                const requestOptions = {
                  method: 'GET', // Assuming you're fetching student data with a GET request
                  headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                    'Content-Type': 'application/json'
                  }
                };
                try {
                    const response = await fetch('/api/attendance/calculateTotalStudentsPerMajor',requestOptions);
                    const data = await response.json();
                    const transformedData = data.map((item, index) => ({
                        id: item.major.toLowerCase(), // Assuming 'major' is the key for the major name
                        label: item.major,
                        value: item.totalStudents,
                        color: `hsl(${index * 250}, 70%, 50%)`, // Adjust color generation as needed
                      }));
                      setPieData(transformedData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
              console.log(pieData);

            fetchData();
        }, []);
    return(
    <ResponsivePie
        data={pieData}
        margin={{ top: 40, right: 55, bottom: 80, left: 80 }}
        cornerRadius={8}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'purple_orange' }}
        borderWidth={1}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.2
                ]
            ]
        }}
        enableArcLinkLabels={false}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    2
                ]
            ]
        }}
        defs={[
        ]}
        fill={[
        ]}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 80,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
)}
export default PieChart ;