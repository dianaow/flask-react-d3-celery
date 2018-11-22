import React, { Component } from 'react'
import { event } from 'd3-selection';

export default class Tooltip extends Component {

  render() {
    var visibility="hidden"
    var transform=""
    var width=90
    var height=40
    var transformText='translate('+width/2+','+(height/2)+')';
 
    if(this.props.tooltip.display==true){
        visibility="visible"
        transform='translate(' + (this.props.tooltip.pos.x+width/2-20) + ',' + (this.props.tooltip.pos.y-height/2) + ')';

    } else {
        visibility="hidden"
    }

    return (
        <g transform={transform}>
            <rect visibility={visibility} width={width} height={height} fill='#E0E0E0' opacity='0.9'/>
            <text visibility={visibility} transform={transformText}>
                <tspan x="0" textAnchor="middle" fontSize="15px" fill="black">{this.props.tooltip.data.key}</tspan>
                <tspan x="0" textAnchor="middle" dy="15" fontSize="12px" fill="black">{Number(this.props.tooltip.data.value).toPrecision(4)}</tspan>
            </text>
        </g>
    );

  }
}