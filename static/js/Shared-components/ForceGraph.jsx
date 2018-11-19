import React, { Component } from 'react'
import * as d3 from 'd3-force';
import _ from 'lodash';

class ForceGraph extends Component {

  constructor() {
    super()
    this.state = {nodes: []}
    this.forceStrength = 0.8
    this.charge=1
  }

  componentDidMount() {
    this.updateNodePositions(this.props.nodes)
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.nodes != prevProps.nodes) {
        this.updateNodePositions(this.props.nodes)
      }
  }

  updateNodePositions = (nodes) => {

    var center = { x: this.props.svgDimensions.width / 2, y: this.props.svgDimensions.height / 2 };

    this.simulation = d3.forceSimulation(nodes)  
      .force('charge', d3.forceManyBody().strength(this.charge))
      .force("collide", d3.forceCollide(4))
      .alphaDecay(0.1)
      .velocityDecay(0.4)
      .force('x', d3.forceX().strength(this.forceStrength).x(d => d.cx))
      .force('y', d3.forceY().strength(this.forceStrength).y(d => d.cy))

    this.simulation.on('tick', () => this.setState({nodes}))

  }

  render() {

    const {nodes} = this.state

    var dots = (
      nodes.map( d =>
        <circle
          className={d.driverRef}
          key={d.id}
          cx={d.x}
          cy={d.y}
          r={d.radius}
          fill={d.color}
          opacity='1'
        />)
    )

    return (
      <g>
        {dots}
      </g>
    )
  }

}

export default ForceGraph;