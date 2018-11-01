import React, { Component, Fragment } from 'react'

export default class Lines extends Component {

  render() {
    const { scales, lapsData, psData, svgDimensions} = this.props
    const { xScale, yScale, colorScale } = scales
    const { height, width } = svgDimensions

    const labelText = {
     letterSpacing: '2px',
     fontWeight: 'bold'
    }

    const dots = (
      lapsData.map( d =>
        <circle
          key={d.id}
          cx={xScale(d.lap)}
          cy={yScale(d.time)}
          r={3}
          fill={colorScale(d.constructorRef)}
        />
      )
    )

    return (
      <g>
      {dots}
      </g>
    )
  }
}