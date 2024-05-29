// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bar
import { ResponsiveBar } from '@nivo/bar'
import {data} from './Barchartdata';
import React, { useEffect, useState } from 'react';
import { set } from 'date-fns';
function Barchart() {
    const [absencesPerMajor, setAbsencesPerMajor] = useState([]);
    
            useEffect(() => {
                async function fetchAbsencesPerMajor() {
                    try {
                        const response = await fetch('/api/attendance/calculateAbsencesPerMajor');
                        const data = await response.json();
        
                            console.log('Data is not in expected format:', data);
                        setAbsencesPerMajor(data);
                    } catch (error) {
                        console.error('Error fetching absences per major:', error);
                    }
                }
                fetchAbsencesPerMajor();
            
                    console.log(',,,,,,,,,,,,,,,,,,,,,,,,')

          console.log(absencesPerMajor);

        }, []);
      
    return(
    
    <ResponsiveBar
        data={absencesPerMajor}
        keys={['hot dog']}
        indexBy="country"
        margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
        padding={0.85}
        groupMode="grouped"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={['#FB6340']}
        defs={[
        
        ]}
        borderRadius={6}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
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
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: 0,

            legendPosition: 'middle',
            legendOffset: 32,
            truncateTickAt: 0
        }}
        axisLeft={{
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: -40,
            truncateTickAt: 0
        }}

        enableGridY={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        legends={[
    ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
    />
)
    ;
}
export default Barchart;