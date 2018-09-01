import React,{ Component } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';

import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';

class BarChart1 extends Component {

  render() {
    
    const svgWidth = 960,
      svgHeight = 500;
    
    //Note: getting width and height from a variable rather than the elements attribute e.g. svg.attr("width")
    const margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = svgWidth - margin.left - margin.right,
      height = svgHeight - margin.top - margin.bottom;
    
    const x = scaleBand()
        .rangeRound([0, width])
        .padding(0.1),
      y = scaleLinear().rangeRound([height, 0]);

    const data = this.props.data;
    console.log(data);

    x.domain(data.map(d => d.race_name));
    y.domain([0, max(data, d => d.id)]);
    
    console.log(x);
    console.log(y);

    return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g
          className="axis axis--x"
          transform={`translate(0, ${height})`}
          ref={node => select(node).call(axisBottom(x))}
        />
        <g className="axis axis--y">
          <g ref={node => select(node).call(axisLeft(y).ticks(10))} />
          <text transform="rotate(-90)" y="6" dy="0.71em" textAnchor="end">
            Count
          </text>
        </g>
        {data.map(d => (
          <rect
            key={d.race_name}
            className="bar"
            x={x(d.race_name)}
            y={y(d.id)}
            width={x.bandwidth()}
            height={height - y(d.id)}
          />
        ))}
      </g>
    </svg>
    );
  }
};

export default BarChart1;