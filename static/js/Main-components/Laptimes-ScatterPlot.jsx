import React,{ Component} from 'react';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max, range } from 'd3-array';
import * as d3 from 'd3-selection'
import Axis from '../Shared-components/Axis'
import Dots from '../Shared-components/Dots'
import Tooltip from '../Shared-components/Tooltip'

class ScatterPlot extends Component {

  constructor() {
    super()
    this.xscale = scaleBand()
    this.yscale = scaleLinear()
    this.colorScale = scaleOrdinal()
    this.state = {
      tooltip:{ display:false,data:{key:'',value:''}},
    }
  }

  handleMouseOver = (e) => {
    this.setState({tooltip:{
        display:true,
        data: {
            key:e.driverRef,
            value:e.y
            },
        pos:{
            x:e.x,
            y:e.y
            }
      }
    })
  }

  handleMouseOut = (e) => {
    this.setState({tooltip:{
        display:false,
        data: {
            key:'',
            value:''
            }
      }
    })
  }

  render() {
    
    const{lapsData, minLapTime} = this.props

    const wrapper = { width: this.props.width, height: this.props.height }
    const axisSpace = { width: 30, height: 30 }
    const margins = { top: 30, right: 20, bottom: 30, left: 30 }
    const svgDimensions = { width: wrapper.width - axisSpace.width - margins.left - margins.right, 
                            height: wrapper.height - axisSpace.height - margins.top - margins.bottom}

    const xScale = this.xscale
                    .domain(lapsData.map(d => d.lap))
                    .range([margins.left, svgDimensions.width])

    const yScale = this.yscale
                    .domain([min(lapsData.map(d => d.time))-1, max(lapsData.map(d => d.time))])
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

    const textStyle = {
      textAlign: 'center',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    } 

    const xProps = {
      orient: 'Bottom',
      scale: xScale,
      translate: `translate(0, ${svgDimensions.height})`,
      tickSize: svgDimensions.height,
      tickValues: xScale.domain().filter(function(d,i){ return !(i%5)})
    }

    const yProps = {
      orient: 'Left',
      scale: yScale,
      translate: `translate(${margins.left}, 0)`,
      tickSize: 0,
      tickValues: range(Math.round(min(lapsData.map(d => d.time))), Math.round(max(lapsData.map(d => d.time))+1), 1)
    }

    const lapsData_new = lapsData.map(d => {
      return {
          id: d.id,
          radius: 3, 
          color: colorScale(d.constructorRef),
          x: xScale(d.lap),
          y: yScale(d.time),
          driverRef: d.driverRef
      };
    });

    const topLegendStyle = {
      color: '#E0E0E0',
      fontSize: '12px'
    } 
    console.log(lapsData)
    return (
      <svg width={wrapper.width} height={wrapper.height}>
        <g transform={"translate(" + (axisSpace.width + margins.left) + "," + (margins.top) + ")"}>
          <Axis {...xProps} />
          <Axis {...yProps} />
          <Dots
            data={lapsData_new}
            onMouseOverCallback={this.handleMouseOver}
            onMouseOutCallback={this.handleMouseOut}
            tooltip={this.state.tooltip}
          />
          <Tooltip
            tooltip={this.state.tooltip}
          /> 
          <text 
            style={textStyle}
            transform={"translate(" + (-margins.left) + "," + (svgDimensions.height/2 + margins.top + axisSpace.height) + ")rotate(-90)"}>
            Time to complete (in sec)
          </text>
          <text 
            style={textStyle}
            transform={"translate(" + (svgDimensions.width/2 - axisSpace.width - margins.left) + "," + (svgDimensions.height + axisSpace.height) + ")"}>
            Lap
          </text>
          <text
            style={topLegendStyle}
            transform={"translate(" + (margins.left) + "," + "0)"}>
              Pitlaps and Laptimes above the 99.5th percentile are filtered out.
          </text>
        </g>
      </svg>
    )
  }

}

export default ScatterPlot;