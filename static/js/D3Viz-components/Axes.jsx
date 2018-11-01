import React from 'react'
import Axis from './Axis'

export default ({ scales, margins, svgDimensions}) => {

  const { height, width } = svgDimensions

  const xProps = {
    orient: 'Bottom',
    scale: scales.xScale,
    translate: `translate(0, ${height + margins.bottom})`,
    tickSizeOuter: 6,
    tickPadding: 10
  }

  const yProps = {
    orient: 'Left',
    scale: scales.yScale,
    translate: `translate(${margins.left}, 0)`,
    tickSizeOuter: 6,
    tickPadding: 10
  }


  return (
    <g>
      <Axis {...xProps} />
      <Axis {...yProps} />
    </g>
  )
}
