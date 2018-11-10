import React,{ Component} from 'react';
import * as d3 from 'd3-force';
import Dots from './Dots';
import _ from 'lodash';

class ForceGraph extends Component {

  constructor() {
    super();
    this.state = {nodes: []};
  }

  componentDidMount() {
    this.updateNodePositions(this.props.nodes)
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.nodes != prevProps.nodes) {
        this.updateNodePositions(this.props.nodes)
      }
  }

  componentWillUnmount() {
    this.force.stop()
  }

  updateNodePositions = (nodes) => {
    this.force = d3.forceSimulation(nodes)
                  .force("x", d3.forceX(d => d.cx))
                  .force("y", d3.forceY(d => d.cy))
                  .force("collide", d3.forceCollide(3))

    this.force.on('tick', () => this.setState({nodes}))
  }

  render() {

    const {nodes} = this.state

    return (
      <Dots
        data={nodes}
      />
    )
  }

}

export default ForceGraph;