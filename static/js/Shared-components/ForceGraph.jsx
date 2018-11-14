import React,{ Component} from 'react';
import * as d3 from 'd3-force';
import Dots from './Dots';
import _ from 'lodash';

class ForceGraph extends Component {

  componentWillMount() {
    this.updateNodePositions(this.props.nodes)
  }

  componentWillReceiveProps(nextProps) {
    this.updateNodePositions(this.nextProps)
    console.log(this.props.nodes, nextProps.nodes)
  }

  updateNodePositions = (nodes) => {
    var simulation = d3.forceSimulation()
                   .nodes(nodes)
                   .force("x", d3.forceX(d => d.cx))
                   .force("y", d3.forceY(d => d.cy))
                   .force("collide", d3.forceCollide(3))

    simulation.alpha(1).restart()
  }

  render() {

    const {nodes} = this.props

    console.log(nodes)

    return (
      <svg ref='container' />
    )
  }

}

export default ForceGraph;