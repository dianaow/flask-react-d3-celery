import React from 'react'
import Axis from './Axis'

export default ({ scales, margins }) => {

  const yProps = {
    orient: 'Left',
    scale: scales.yScale,
    translate: `translate(${margins.left}, 0)`,
    tickSizeOuter: 6,
    tickPadding: 10
  }

  return (
    <Axis {...yProps} />
  )
}
