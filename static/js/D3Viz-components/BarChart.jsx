import React,{ Component } from 'react';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { schemeCategory20 } from 'd3-scale-chromatic';
import Axes from './Axes'
import Bars from './Bars'

class BarChart extends Component {

  constructor() {
    super()
    this.xScale = scaleBand()
    this.yScale = scaleLinear()
  }

  render() {
    
    const data = this.props.data

    const margins = { top: 20, right: 20, bottom: 30, left: 40 }
    const svgDimensions = { width: this.props.width, height: this.props.height }

    const xScale = this.xScale
      .padding(0.1)
      .domain(data.map(d => d.driverRef))
      .range([margins.left, svgDimensions.width - margins.right])
  
    const yScale = this.yScale
      .domain([0, max(data, d => d.position)])
      .range([svgDimensions.height - margins.bottom, margins.top])

    return (
      <svg width={svgDimensions.width} height={svgDimensions.height}>
        <Axes
          scales={{ xScale, yScale }}
          margins={margins}
          svgDimensions={svgDimensions}
        />
        <Bars
          scales={{ xScale, yScale }}
          margins={margins}
          data={data}
          svgDimensions={svgDimensions}
        />
      </svg>
    );
  }

};

export default BarChart;