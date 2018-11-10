import React,{ Component} from 'react';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max, range, sum, quantile } from 'd3-array';
import * as d3Collection from 'd3-collection';
import Axis from '../Shared-components/Axis'
import ForceGraph from '../Shared-components/ForceGraph'
import Loading from '../Shared-components/Loading';

class BeeswarmPlot extends Component {

  constructor() {
    super()
    this.xscale = scaleLinear()
    this.yscale = scaleBand()
    this.colorScale = scaleOrdinal()
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

  createNodes = (lapsData, xScale, yScale, colorScale) => {

    var data = lapsData.slice()

    var radius = 3;

    // Get an array of all the sorted 'values' columns (or 1 sec intervals) 
    var value_fields = range(85.0, 106.0, 1)
    value_fields = value_fields.sort((a, b) => { return a-b })
    value_fields = value_fields.map(d => d.toFixed(1))
    xScale.domain([value_fields[0], value_fields[value_fields.length-1]])

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
    drivers.forEach(function(driver,driver_i) {

      var temp_data = value_fields.map(function(col) {
          var x = driver.values[0][col];
          if (x === undefined) {
              x = 0;
          } 
          return x
      });

      // Create nodes based on absolute count.
      var cnt_so_far = 0;
      temp_data.forEach(function(d,i) {
          var new_nodes = range(d).map( x => {
              return {
                  id: driver.key + i.toString() + '_' + x.toString(),
                  radius: radius,
                  color: colorScale(driver.values[0].constructorRef),
                  cx: xScale(value_fields[i]),
                  cy: yScale(driver.key)
              };
          });
          nodes = nodes.concat(new_nodes);
          cnt_so_far += d;
      });
    
    drivers[driver_i].cnt = cnt_so_far;
    })
    
    return {nodes:nodes, xscale_domain:xScale.domain()}
  }

  render() {
    
    const{lapsData} = this.props
    
    const wrapper = { width: this.props.width, height: this.props.height }
    const axisSpace = { width: 30, height: 30 }
    const margins = { top: 30, right: 20, bottom: 30, left: 30 }
    const svgDimensions = { width: wrapper.width - axisSpace.width - margins.left - margins.right, 
                            height: wrapper.height - axisSpace.height - margins.top - margins.bottom}

    const xScale = this.xscale
                    .range([margins.left, svgDimensions.width])

    const yScale = this.yscale
                    .domain(lapsData.map(d => d.driverRef))
                    .range([svgDimensions.height, margins.top])

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

    const colorScale = this.colorScale 
                        .domain(teamColors.map(d => d.key))
                        .range(teamColors.map(d => d.value))
 
    var nodes = this.createNodes(lapsData, xScale, yScale, colorScale)
    //console.log(nodes.nodes)
    const textStyle = {
      textAlign: 'center',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    } 

    const xProps = {
      orient: 'Bottom',
      scale: xScale,
      translate: `translate(0, ${svgDimensions.height})`,
      tickSize: 0,
      tickValues: range(85.0, 106.0, 1)
    }

    const yProps = {
      orient: 'Left',
      scale: yScale,
      translate: `translate(${margins.left}, 0)`,
      tickSize: 0,
      tickValues: yScale.domain()
    }

    if (nodes.nodes.length != 0) {
      var forces = 
          <ForceGraph
            nodes={nodes.nodes}
          />
     } else {
      var forces = <Loading width="1200" height="850"/>
    }

    return (

      <svg width={wrapper.width} height={wrapper.height}>
        <g transform={"translate(" + (axisSpace.width + margins.left) + "," + (margins.top) + ")"}>
          <Axis {...xProps} />
          <Axis {...yProps} />
          // use React to draw all the nodes, d3 already calculated the x and y
          {forces}
          <text 
            style={textStyle}
            transform={"translate(" + (svgDimensions.width/2 - axisSpace.width - margins.left) + "," + (svgDimensions.height + axisSpace.height) + ")"}>
            Time to complete (in sec)
          </text>
        </g>
      </svg>
    )
  }

}

export default BeeswarmPlot;