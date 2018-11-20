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
            value:e.time
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
    const margins = { top: 60, right: 30, bottom: 0, left: 60 }
    const svgDimensions = { width: wrapper.width - margins.left - margins.right, 
                            height: wrapper.height - margins.top - margins.bottom}

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

    const bandSize = xScale.bandwidth()

    const xProps = {
      orient: 'Bottom',
      scale: xScale,
      translate: `translate(-${bandSize/2}, ${svgDimensions.height})`,
      tickSize: svgDimensions.height-margins.top,
      tickValues: xScale.domain().filter(function(d,i){ return !(i%4)})
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
          driverRef: d.driverRef,
          time: d.time
      };
    });

    const topLegendStyle = {
      color: '#E0E0E0',
      fontSize: '12px'
    } 

    return (
      <svg width={wrapper.width} height={wrapper.height}>
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
          transform={"translate(" + 10 + "," + (svgDimensions.height/2) + ")rotate(-90)"}>
          Time to complete (in sec)
        </text>
        <text 
          style={textStyle}
          transform={"translate(" + (svgDimensions.width/2) + "," + (svgDimensions.height+30) + ")"}>
          Lap
        </text>
        <text
          style={topLegendStyle}
          transform={"translate(" + (margins.left) + "," + 10 + ")"}>
            Pitlaps and Laptimes above the 99.5th percentile are filtered out.
        </text>
      </svg>
    )
  }

}

export default ScatterPlot;