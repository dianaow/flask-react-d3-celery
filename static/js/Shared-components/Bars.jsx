import React, { Component, Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Bars extends Component {

  textColor = (e) => {
    if(e <= 10){
      return 'black';
    } else {
      return 'white';
    }
  }

  textPosition = (e, xScale, height, margins) => {
    if(e.position <= 10){
      return "translate(" + (xScale(e.driverRef) + xScale.bandwidth()/2) + "," + ((height/2)-margins.bottom) + ")rotate(-90)" 
    } else {
      return "translate(" + (xScale(e.driverRef) + xScale.bandwidth()/2) + "," + (height-margins.bottom)  + ")rotate(-90)"
    }
  }


  textStatus = (e) => {

    if(e != "Finished" && e != "+1 Lap" && e != "+2 Laps" && e != "+3 Laps"  && e != "+4 Laps" ){
      return e.substring(0,3).toUpperCase()
    } else if(e == "Transmission" && e == "Clutch" && e == "Hydraulics"  && e == "Electrical" && e == "Radiator" && e == "Brakes"  && e == "Differential" && e == "Overheating"  && e == "Mechanical" && e == "Tyre" && e == "Puncture"  && e == "Drivershaft"){
      return "MEC"
    }
     else {
      return ""
    }
  }

  render() {
    const { scales, data, raceData, svgDimensions, margins, axisSpace } = this.props
    const { xScale, yScale, colorScale } = scales
    const { height } = svgDimensions

    const barText = {
     letterSpacing: '2px',
     fontWeight: 'bold'
    }

    const bars = (
      data.map(d =>
        <rect
          key={d.id}
          x={xScale(d.driverRef)}
          y={yScale(d.position)}
          fill={colorScale(d.constructorRef)}
          width={xScale.bandwidth()}
          height={height - yScale(d.position)}
        />
      )
    )

    const text = (
      data.map( d =>
        <text
          style={barText}
          key={d.id}
          fill={this.textColor(d.position)}
          transform={this.textPosition(d, xScale, height, margins)}
        >
         {d.driverRef}
        </text>
      )
    )


    const status = (
      raceData.map( d =>
        <text
          key={d.id}
          fill='black'
          transform={"translate(" + (xScale(d.driverRef)) + "," + (height+axisSpace.height) + ")"}
        >
         {this.textStatus(d.status)}
        </text>
      )   
    )

    return (
      <g>
      {bars}
      {text}
      {status}
      </g>
    )
  }
}