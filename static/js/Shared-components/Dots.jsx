import React, { Component } from 'react'

export default class Dots extends Component {

  render() {
    const { data } = this.props

    const dots = (
      data.map( d =>
        <circle
          key={d.id}
          cx={d.x}
          cy={d.y}
          r={d.radius}
          fill={d.color}
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