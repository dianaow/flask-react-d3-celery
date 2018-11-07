import React,{ Component} from 'react';
import * as d3 from 'd3-force';
import Dots from './Dots';

class ForceGraph extends Component {

  constructor() {
    super()
    this.state = {nodes: []}
  }
  
  componentDidMount() {

    const {nodes} = this.props

    this.force = d3.forceSimulation(nodes)
                  .force("x", d3.forceX(d => d.cx))
                  .force("y", d3.forceY(d => d.cy))
                  .force("collide", d3.forceCollide(3))

    this.force.on('tick', () => this.setState({nodes}))
  }

  componentWillUnmount() {
    this.force.stop()
  }

  render() {
    console.log(this.state.nodes)
    return (
      <Dots
        data={this.state.nodes}
      />
    )
  }

}

export default ForceGraph;
