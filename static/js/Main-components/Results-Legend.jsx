import React, { Component, Fragment } from 'react'

export default class Legend extends Component {
	

	sumPoints = (data) => {
		const sum = [
		  ...data.reduce(
		    (map, item) => {
		      const { constructorRef: key, points } = item;
		      const prev = map.get(key);
		      if(prev) {
		        prev.points += points
		      } else {
		        map.set(key, Object.assign({}, item))
		      }
		      
		      return map
		    },
		    new Map()
		  ).values()
		]

		return sum
	}

    sortPoints = (summedPoints, tmp, colormap) => {

    	const uniqTeams = [...new Set(summedPoints.map(d => d.constructorRef))]
		var filtered = [];

		colormap.map(d => {
		   uniqTeams.map(f => {
		       if(d.key == f){
		          filtered.push(d);
		         }
		   })
		})

        filtered.sort((a, b) => { return tmp.indexOf(b.key) - tmp.indexOf(a.key) })
	    return filtered
    }

	render() {
    
    	const colormap = this.props.colormap
	    const data = this.props.data
	    const raceData = this.props.raceData

	    var summedPoints = this.sumPoints(raceData)
	    summedPoints.sort((a, b) => { return (b.points) - (a.points) })
	    var tmp = summedPoints.map(d => d.constructorRef)
	    var filt_colormap = this.sortPoints(summedPoints, tmp, colormap)

	    const legendText = (
	      filt_colormap.map( d =>
	        <text
	          key={tmp.indexOf(d.key)}
	          fill='black'
	          x={30}
	          y={(tmp.indexOf(d.key) * 30)+30}
	          style={{'fontSize': '12px', 'textAlign': 'left'}}
	        >
	          {d.key}
	        </text>
	      )
	    )

	    const legendCalc = (
	      summedPoints.map( d =>
	        <text
	          key={tmp.indexOf(d.constructorRef)}
	          fill='white'
	          x={130}
	          y={(tmp.indexOf(d.constructorRef) * 30)+30}
	          style={{'fontSize': '14px', 'textAlign': 'middle', 'fontWeight': 'bold'}}
	        > 
	         {d.points}
	        </text>
	      )
	    )
	    
	    const legendColorBar = (
	      filt_colormap.map( d =>
	        <rect
	          key={tmp.indexOf(d.key)}
	          fill={d.value}
	          x={120}
	          y={(tmp.indexOf(d.key) * 30)+15}
	          width={30}
	          height={30}
	        />
	      )
	    )

	    return (
	      <g>
	      	<text x={120} y={0}>Points</text>
	      	{legendColorBar}
		    {legendText}
		    {legendCalc}
	      </g>
	    )
	}

}