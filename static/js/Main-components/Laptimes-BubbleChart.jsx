import React, { Component } from 'react'
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max, range, sum, quantile } from 'd3-array';
import * as d3Collection from 'd3-collection';
import * as d3 from 'd3-force';
import { select, selectAll } from 'd3-selection';
import Axis from '../Shared-components/Axis'

export default class BubbleChart extends Component {

  constructor(props) {
    super(props)
    this.wrapper = { width: this.props.width, height: this.props.height }
    this.axisSpace = { width: 30, height: 30 }
    this.margins = { top: 30, right: 20, bottom: 30, left: 30 }
    this.svgDimensions = { width: this.wrapper.width - this.axisSpace.width - this.margins.left - this.margins.right, 
                           height: this.wrapper.height - this.axisSpace.height - this.margins.top - this.margins.bottom}

    const teamColors = [{id:1, key: "ferrari", value: "#DC0000"},
                       {id:2, key: "mercedes", value: "#01d2be"},
                       {id:3, key: "red_bull", value: "#09153B"},
                       {id:4, key: "force_india", value: "#F595C8"},
                       {id:5, key: "haas", value: "#828282"},
                       {id:6, key: "mclaren", value: "#FF8700"},
                       {id:7, key: "renault", value: "#FFD700"},
                       {id:8, key: "sauber", value: "#9B0000"},
                       {id:9, key: "toro_rosso", value: "#021688"},
                       {id:10, key: "williams", value: "#002F5F"},
                       {id:11, key: "manor", value: "#007AC0"}]

    this.colorScale = scaleOrdinal()
                        .domain(teamColors.map(d => d.key))
                        .range(teamColors.map(d => d.value))
    
    this.bubbles = null
    this.nodes = []
    this.xScale = scaleLinear()
    this.yScale = scaleBand()
    this.xProps = {}
    this.yProps = {}
    this.simulation = d3.forceSimulation()  
  }

  componentDidMount() {
    this.updateProps()
    this.container = select(this.refs.container)
    this.createNodes()
    this.renderNodes()
    this.simulation.nodes(this.nodes)
               .on('tick', this.ticked)
  }

  componentDidUpdate(prevProps) {
    if(!equal(this.props.lapsData, prevProps.lapsData)) {
      this.updateProps()
    }
    this.createNodes()
    this.simulation.nodes(this.nodes)
               .on('tick', this.ticked)
    this.simulation.alpha(0.8).restart()
  }

  updateProps = () => {
    this.xScale = this.xScale
                    .range([this.margins.left, this.svgDimensions.width])

    this.yScale = this.yScale
                    .domain(this.props.lapsData.map(d => d.driverRef))
                    .range([this.svgDimensions.height, this.margins.top])

    this.xProps = {
      orient: 'Bottom',
      scale: this.xScale,
      translate: `translate(0, ${this.svgDimensions.height})`,
      tickSize: 0,
      tickValues: range(85.0, 106.0, 1)
    }

    this.yProps = {
      orient: 'Left',
      scale: this.yScale,
      translate: `translate(${this.margins.left}, 0)`,
      tickSize: 0,
      tickValues: this.yScale.domain()
    }

    this.simulation
      .force('charge', d3.forceManyBody().strength(this.charge))
      .force("collide", d3.forceCollide(4))
      .alphaDecay(.0005)
      .velocityDecay(0.2)
      .force('x', d3.forceX().strength(0.3).x(d => d.x))
      .force('y', d3.forceY().strength(0.3).y(d => d.y))

    return xScale, yScale, xProps, yProps, simulation
  }

  charge = (d) => {
    return -Math.pow(d.radius, 2.0) * this.forceStrength;
  }

  getKeyValues = (arr) => {
      return arr.reduce((a,b) => {
          let keys = Object.keys(b);
          keys.forEach(v => {
            a.push(v)
          });
        return a
      }, [])
  }

  pruneObject = (object, desiredKeys) => {
    Object.keys(object)
      .filter(key => !desiredKeys.includes(key))  //Ignore desired keys
      .forEach(key => delete object[key])         //Remove the leftovers
  }
  
  createNodes = () => {
    var data = this.props.lapsData.slice()
    var radius = 3;

    // Get an array of all the sorted 'values' columns (or 1 sec intervals) 
    var value_fields = range(85.0, 106.0, 1)
    value_fields = value_fields.sort((a, b) => { return a-b })
    value_fields = value_fields.map(d => d.toFixed(1))
    this.xScale.domain([value_fields[0], value_fields[value_fields.length-1]])

    // Add back the string labels
    var newItems = ['constructorRef', 'driverRef', 'season', 'raceName']; 
    let arr = value_fields.slice()
    arr.push(...newItems); 

    //Prune columns 'values' not in arr for each driver
    data.forEach((item,index) => this.pruneObject(item, arr)); 

    // Nest the data by driver name
    var drivers = d3Collection.nest()
                  .key(d => d.driverRef)
                  .entries(data)

    var nodes = [];
    
    // Iterate over each driver
    drivers.forEach((driver,driver_i) => {
      var temp_data = value_fields.map(function(col) {
          var x = driver.values[0][col];
          if (x === undefined) {
              x = 0;
          } 
          return x
      });

      // Create nodes based on absolute count.
      var cnt_so_far = 0;
      temp_data.forEach((d,i) => {
          var new_nodes = range(d).map( x => {
              return {
                  id: driver.key + i.toString() + '_' + x.toString(),
                  radius: radius,
                  color: this.colorScale(driver.values[0].constructorRef),
                  x: this.xScale(value_fields[i]),
                  y: this.yScale(driver.key)
              };
          });
          nodes = nodes.concat(new_nodes);
          cnt_so_far += d;
      });
    
    drivers[driver_i].cnt = cnt_so_far;
    })
    
    this.nodes = nodes

  }

  renderNodes = () => {

    this.bubbles = this.container.selectAll('.bubble')
      .data(this.nodes, d => d.id)
    .enter().append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      
  }

  ticked = () => {
    this.bubbles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
  }

  render() {
    console.log(this.yScale.domain())
    console.log(this.yProps)
    return (
      <svg width={this.wrapper.width} height={this.wrapper.height}>
        <g transform={"translate(" + (this.axisSpace.width + this.margins.left) + "," + (this.margins.top) + ")"} ref='container' />
        <Axis {...this.xProps} />
        <Axis {...this.yProps} />
      </svg>
    )
  }


}

