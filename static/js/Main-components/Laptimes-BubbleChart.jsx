import React, { Component } from 'react'
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max, range, sum, quantile } from 'd3-array';
import * as d3Collection from 'd3-collection';
import * as d3 from 'd3-force';
import { select, selectAll } from 'd3-selection';

export default class BubbleChart extends Component {

  constructor(props) {
    super(props)
    this.wrapper = { width: this.props.width, height: this.props.height }
    this.axisSpace = { width: 30, height: 30 }
    this.margins = { top: 30, right: 20, bottom: 30, left: 30 }
    this.svgDimensions = { width: this.wrapper.width - this.axisSpace.width - this.margins.left - this.margins.right, 
                           height: this.wrapper.height - this.axisSpace.height - this.margins.top - this.margins.bottom}

    this.xScale = scaleLinear()
                    .range([this.margins.left, this.svgDimensions.width])
    this.yScale = scaleBand()
                    .domain(this.props.lapsData.map(d => d.driverRef))
                    .range([this.svgDimensions.height, this.margins.top])

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

    this.bubbles = null;
    this.nodes = [];
    this.forceStrength = 0.03;

    this.simulation = d3.forceSimulation()
      .velocityDecay(0.2)
      .force('x', d3.forceX().strength(this.forceStrength).x(d => d.x))
      .force('y', d3.forceY().strength(this.forceStrength).y(d => d.y))
      .force('charge', d3.forceManyBody().strength(this.charge))
      .force("collide", d3.forceCollide(3))
          
  }

  componentDidMount() {
    this.container = select(this.refs.container)
    this.createNodes()
    this.renderNodes()
    this.simulation.nodes(this.nodes)
                   .on('tick', this.ticked)
  }

  componentDidUpdate() {
    this.createNodes()
    this.simulation.nodes(this.nodes)
                   .on('tick', this.ticked)
    this.simulation.alpha(1).restart()
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

  charge = (d) => {
    return -Math.pow(d.radius, 2.0) * this.forceStrength;
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
    return (
      <svg width={this.wrapper.width} height={this.wrapper.height}>
        <g transform={"translate(" + (this.axisSpace.width + this.margins.left) + "," + (this.margins.top) + ")"} ref='container' />
      </svg>
    )
  }


}

