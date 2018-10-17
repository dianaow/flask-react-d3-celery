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

  textPosition = (e, xScale, height) => {
    if(e.position <= 10){
      return "translate(" + (xScale(e.driverRef) + xScale.bandwidth()/2) + "," + ((height/2)-30) + ")rotate(-90)" 
    } else {
      return "translate(" + (xScale(e.driverRef) + xScale.bandwidth()/2) + "," + (height-30)  + ")rotate(-90)"
    }
  }

  render() {
    const { scales, data, raceData, svgDimensions } = this.props
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
          transform={this.textPosition(d, xScale, height)}
        >
         {d.driverRef}
        </text>
      )
    )

    return (
      <g>
      {bars}
      {text}
      </g>
    )
  }
}