import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import Dropdown from '../D3Viz-components/Dropdown';
import BarChart from '../D3Viz-components/BarChart'
import LineChart from '../D3Viz-components/LineChart'
import Loading from './Loading'
import { max, min } from 'd3-array';
import axios from 'axios'

const RESULTS_SERVICE_URL = `${process.env.RESULTS_SERVICE_URL}`
const RACES_SERVICE_URL = `${process.env.RACES_SERVICE_URL}`
const QUAL_SERVICE_URL = `${process.env.QUAL_SERVICE_URL}`
const LAPTIMES_SERVICE_URL = `${process.env.LAPTIMES_SERVICE_URL}`
const PITSTOPS_SERVICE_URL = `${process.env.PITSTOPS_SERVICE_URL}`

class Results extends Component {

  constructor(){
    super()
    this.state = {
      results: [],
      quals: [],
      races: [],
      seasons: [],
      laptimes: [],
      pitstops: [],
      results_isLoaded: false,
      quals_isLoaded: false,
      races_isLoaded: false,
      laps_isLoaded: false,
      ps_isLoaded: false
    };
  }

  componentDidMount(){

  	const resultsRequest = axios.get(RESULTS_SERVICE_URL)
  								.then(response => {this.setState({results: response.data.data})})

	  const qualRequest = axios.get(QUAL_SERVICE_URL)
							    .then(response => {this.setState({quals: response.data.data})})

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
						  .then(this.setState({races_isLoaded: true}))

    const pitstopsRequest = axios.get(PITSTOPS_SERVICE_URL)
                 .then(response => {this.setState({pitstops: response.data.data})})

  	const laptimesRequest = axios.get(LAPTIMES_SERVICE_URL)
								 .then(response => {this.setState({laptimes: response.data.data})})

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

  filterAndSort_ResQual = (selectedRace, selectedSeason, results, quals, returnQual) => {

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

  filterAndSort_LapsPS = (selectedRace, selectedSeason, laptimes, pitstops, returnLaps) => {

	  var filteredLapsResults = laptimes.filter(d => (d.raceName === selectedRace.raceName && d.season === selectedSeason.season))
    var filteredPSResults = pitstops.filter(d => (d.raceName === selectedRace.raceName && d.season === selectedSeason.season))

    if (returnLaps) {
      return filteredLapsResults
    } else {
      return filteredPSResults
    }

  }


  render() {

  	const{races, seasons, results, quals, laptimes, pitstops} = this.state

    var selectedRace = races.find(d => (d.selected === true))
    var selectedSeason = seasons.find(d => (d.selected === true))

    const chartWrapperStyle = {
      padding: '20px'
    } 

    const headerStyle = {
      textAlign: 'left',
      fontWeight: 'bold',
      minWidth: '350px'
    }

  	if (races.length != 0 && seasons.length != 0 && results.length != 0 && quals.length != 0) {
	    var ResultsChart = 
	      <BarChart 
		        qualData={this.filterAndSort_ResQual(selectedRace, selectedSeason, results, quals, true)} 
		        raceData={this.filterAndSort_ResQual(selectedRace, selectedSeason, results, quals, false)} 
            width="1200" 
            height="450" />
  	} else {
  	 	var ResultsChart = <Loading width="1200" height="450"/>
  	}

  	if (races.length != 0 && seasons.length != 0 && laptimes.length != 0 && pitstops.length != 0) {
	    var LapsChart = 
	      <LineChart 
		    lapsData={this.filterAndSort_LapsPS(selectedRace, selectedSeason, laptimes, pitstops, true)} 
		    psData={this.filterAndSort_LapsPS(selectedRace, selectedSeason, laptimes, pitstops, false)} 
        minLapTime = {min(laptimes, d => d.time)}
        maxLapTime = {max(laptimes, d => d.time)}
        width="1200" 
        height="850" />
  	 } else {
  	 	var LapsChart = <Loading width="1200" height="850"/>
  	}

    if (races.length != 0 && seasons.length != 0)  {
      var Header = <div style={headerStyle}><h3>{selectedSeason.season} {selectedRace.raceName}</h3></div>
    } else {
      var Header = <div style={headerStyle}><h3></h3></div>
    }

    console.log(selectedSeason, selectedRace)

      return (
  	  <div className="header">
  	    <p>FORMULA 1</p>
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
          {Header}
  	    </div>
  	    <div style={chartWrapperStyle}>
  	    	{ResultsChart}
  	    </div>
  	    <div style={chartWrapperStyle}>
  	    	{LapsChart}
  	    </div>
  	  </div>
  	);

    }

}

export default Results;