import { ResponsiveLine } from '@nivo/line'
import {dataM }from './dataM'
import  {dataW} from './dataW'

function Linechart(data = dataM) {
  return (
    <>
     <ResponsiveLine
        data={dataM}
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
export default Linechart;