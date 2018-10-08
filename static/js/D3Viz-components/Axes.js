import React from 'react'
import Axis from './Axis'

export default ({ scales, margins, svgDimensions}) => {
  const { height, width } = svgDimensions

  const yProps = {
    orient: 'Left',
    scale: scales.yScale,
    translate: `translate(${margins.left}, 0)`,
    tickSize: 6,
  }

  return (
    <g>
      <Axis {...yProps} />
    </g>
  )
}
