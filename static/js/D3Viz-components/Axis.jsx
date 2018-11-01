import React, { Component } from 'react'
import * as d3Axis from 'd3-axis'
import { select as d3Select } from 'd3-selection'

export default class Axis extends Component {
  componentDidMount() {
    this.renderAxis()
  }

  componentDidUpdate() {
    this.renderAxis()
  }

  renderAxis() {
    const axisType = `axis${this.props.orient}`
    if (this.props.make_x_gridlines) {
      var axis = d3Axis[axisType]()
                  .scale(this.props.scale)
                  .tickSize(-this.props.tickSize)
                  .tickPadding(this.props.tickPadding)
                  .tickValues(this.props.tickValues)
    } else {
      var axis = d3Axis[axisType]()
                  .scale(this.props.scale)
                  .tickSizeOuter(this.props.tickSizeOuter)
                  .tickPadding(this.props.tickPadding)
    }
                  
    d3Select(this.axisElement).call(axis)
  }

  render() {
    return (
      <g
        className={`Axis Axis-${this.props.orient}`}
        ref={(el) => { this.axisElement = el; }}
        transform={this.props.translate}
        
      />
    )
  }

}