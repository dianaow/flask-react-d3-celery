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
      quals: [],
      races: [],
      seasons: [],
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
									    points: result.points,
									    status : result.status,
									    raceName : result.raceName,
								      	key: 'results',
								        selected: false,
								        id: result.id}))
								    )
							     .then(results => this.setState({results}))

	const qualRequest = axios.get(QUAL_SERVICE_URL)
  							  .then(response =>
								    response.data.data.map(qual => ({
								    	constructorRef : qual.constructorRef,
								    	driverRef : qual.driverRef,
									    season : qual.season,
									    roundId : qual.roundId,
									    raceName : qual.raceName,
									    Q1 : qual.Q1,
									    Q2 : qual.Q2,
									    Q3 : qual.Q3,
									    position : qual.position,
								      	key: 'qualifying',
								        selected: false,
								        id: qual.id}))
								    )
							  .then(quals => this.setState({quals}))	  

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
						  .then(races => this.setDefault(races))

  }

   setDefault = (races) => {
    const uniqYears = [...new Set(races.map(d => d.season))]
  	const seasons =  uniqYears.map((y, index) => ({id: index, season:y, selected: false, key: 'seasons' }) )
  	seasons[0].selected = true;
  	races[0].selected = true;
  	this.setState({seasons, races})
  }

  resetThenSet = (value, key) => {
    let data = [...this.state[key]];
    data.forEach(item => item.selected = false);
    data[value].selected = true;
    this.setState({key: data});
  }

  filterAndSort = (races, seasons, results, quals, returnQual) => {

  	var selectedRace = races.find(d => (d.selected === true))
    var selectedSeason = seasons.find(d => (d.selected === true))

	var filteredResults = results.filter(d => (d.raceName === selectedRace.raceName && d.season === selectedSeason.season))
    var filteredQualResults = quals.filter(d => (d.raceName === selectedRace.raceName && d.season === selectedSeason.season))

    filteredResults.sort((a, b) => { return (a.position) - (b.position) })
    var tmp = filteredResults.map(d => d.driverRef)
    filteredQualResults.sort((a, b) => { return tmp.indexOf(a.driverRef) - tmp.indexOf(b.driverRef) })

    if (returnQual) {
      return filteredQualResults
    } else {
      return filteredResults
    }
  }

  render() {

  	const{races, seasons, results, quals, isLoading} = this.state

	   if (races.length === 0 || seasons.length === 0 || results.length === 0 || quals.length === 0) {
	    return (
		  <div className="Results">
		    <p>Loading...</p>	
		  </div>
		)
	  } else {
	    return (
		  <div className="Results">

		    <p>Formula 1 Race Results</p>

		    <div className="wrapper">
		      <Dropdown
		        title="Year"
		        col="season"
		        list={seasons}
		        resetThenSet={this.resetThenSet}
		      />
		      <Dropdown
		        title="Select a race"
		        col="raceName"
		        list={races}
		        resetThenSet={this.resetThenSet}
		      />
		    </div>

		    <BarChart 
		      qualData={this.filterAndSort(races, seasons, results, quals, true)} 
		      raceData={this.filterAndSort(races, seasons, results, quals, false)} 
              width="1200" 
              height="500" />

		  </div>
		  );
	    }
	  }

}

export default Results;