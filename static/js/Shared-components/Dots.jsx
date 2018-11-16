import React, { Component } from 'react'

export default class Dots extends Component {

  render() {
    const { data, tooltip } = this.props
    //console.log(data)
    //console.log(data.map( d => d.x))

    name = tooltip.data.key
    var selectedData = data.filter(d => d.driverRef === name)
    var nonselectedData = data.filter(d => d.driverRef !== name)

    const selectedDots = (
      selectedData.map( d =>
        <circle
          className={d.driverRef}
          key={d.id}
          cx={d.x}
          cy={d.y}
          r='5'
          fill={d.color}
          stroke='black'
          strokeWidth='2'
          onMouseOver={() => this.props.onMouseOverCallback(d)}
          onMouseOut={() => this.props.onMouseOutCallback(d)}
        />
      )
    )

    if(this.props.tooltip.display==true){
      var dots = (
        nonselectedData.map( d =>
          <circle
            className={d.driverRef}
            key={d.id}
            cx={d.x}
            cy={d.y}
            r={d.radius}
            fill={d.color}
            opacity='0.5'
            onMouseOver={() => this.props.onMouseOverCallback(d)}
            onMouseOut={() => this.props.onMouseOutCallback(d)}
          />
        )
      )
    } else {
      var dots = (
        nonselectedData.map( d =>
          <circle
            className={d.driverRef}
            key={d.id}
            cx={d.x}
            cy={d.y}
            r={d.radius}
            fill={d.color}
            opacity='1'
            onMouseOver={() => this.props.onMouseOverCallback(d)}
            onMouseOut={() => this.props.onMouseOutCallback(d)}
          />
        )
      )
    }

    return (
      <g>
      {dots}
      {selectedDots}
      </g>
    )
  }
}