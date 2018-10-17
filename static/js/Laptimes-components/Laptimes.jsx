import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import Dropdown from '../D3Viz-components/Dropdown';
import BarChart from '../D3Viz-components/BarChart'
import axios from 'axios'

const RESULTS_SERVICE_URL = `${process.env.RESULTS_SERVICE_URL}`
const RACES_SERVICE_URL = `${process.env.RACES_SERVICE_URL}`
const QUAL_SERVICE_URL = `${process.env.QUAL_SERVICE_URL}`

class Results extends Component {

  constructor(){
    super()
    this.state = {
      results: [],
      races: []
    };
  }

  componentDidMount(){

  	const resultsRequest = axios.get(RESULTS_SERVICE_URL)
							    .then(response =>
								    response.data.data.map(result => ({
								      	constructorRef : result.constructorRef,
									    driverRef : result.driverRef,
									    season : result.season,
									    roundId : result.roundId,
									    grid : result.grid,
									    laps : result.laps,
									    position : result.position,
									    status : result.status,
									    raceName : result.raceName,
								      	key: 'results',
								        selected: false,
								        id: result.id}))
								    )
							     .then(results => this.setState({results}))

  	const racesRequest = axios.get(RACES_SERVICE_URL)
  							  .then(response =>
								    response.data.data.map(race => ({
									    season : race.season,
									    roundId : race.roundId,
									    raceName : race.raceName,
								      	key: 'races',
								        selected: false,
								        id: race.id-1}))
								    )
							  .then(races => this.setState({races}))

  }

  resetThenSet = (id, key) => {
    let races = [...this.state[key]];
    races.forEach(item => item.selected = false);
    races[id].selected = true;
    this.setState({races: races});
  }

  render() {

  	  const{races, results} = this.state

  	  const uniqYears = [...new Set(races.map(d => d.year))]
  	  const uniqYearsObj = uniqYears.map((y, index) => ({id: index + 1, year:y }) )

      var selectedRace = races.find(d => (d.selected === true))
      if (selectedRace != null)  {
        var filteredResults = results.filter(d => (d.raceName === selectedRace.raceName && d.year === selectedRace.year))
      } else {
      	var filteredResults = results.filter(d => (d.raceName === 'Australian Grand Prix' && d.year === 2016))
      }

	  return (
		  <div className="Results">

		    <p>Race Results</p>

		    <div className="wrapper">
		      <Dropdown
		        title="Year"
		        list={uniqYearsObj}
		        resetThenSet={this.resetThenSet}
		      />
		      <Dropdown
		        title="Select a race"
		        list={races}
		        resetThenSet={this.resetThenSet}
		      />
		    </div>

		    <BarChart data={filteredResults} 
              width="1000" 
              height="500" />

		  </div>
		);
	  }

}

export default Results;