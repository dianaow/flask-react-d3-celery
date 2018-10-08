import React, { Component } from 'react'
import { scaleOrdinal } from 'd3-scale'

export default class Bars extends Component {
  constructor(props) {
    super(props)

    this.colorScale = scaleOrdinal()
                        .domain(["ferrari", "mercedes", "red_bull", "force_india", "haas", "mclaren", "renault", "sauber",  "toro_rosso", "williams"])
                        .range(["#DC0000", "#01d2be", "#1e41ff", "#F595C8", "#828282", "#FF8700", "#FFF504", "#9B0000", "#469BFF", "#FFFFFF"])

  }

  textColor = (e) => {
    if(e <= 10){
      return 'black';
    } else {
      return 'white';
    }
  }

  render() {
    const { scales, margins, data, svgDimensions } = this.props
    const { xScale, yScale } = scales
    const { height } = svgDimensions

    this.colorScale.domain(data.map(function (d){ return d.constructorRef }));

    const bars = (
      data.map(d =>
        <rect
          key={d.id}
          className="bar"
          x={xScale(d.driverRef)}
          y={yScale(d.position)}
          fill={this.colorScale(d.constructorRef)}
          width={xScale.bandwidth()}
          height={height - margins.bottom - yScale(d.position)}
        />
      )
    )

    const middle = (xScale.bandwidth() / data.length) / 2;

    const text = (
      data.map( d =>
        <text
          key={d.id}
          fill={this.textColor(d.position)}
          transform= {"translate(" + xScale(d.driverRef) + middle + "," + (height - margins.bottom)/2 + ")rotate(-90)"}
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