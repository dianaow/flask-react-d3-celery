import React, { Component } from 'react';
import { max, min, quantile } from 'd3-array';
import axios from 'axios'
import Dropdown from '../Shared-components/Dropdown';
import Loading from '../Shared-components/Loading';
import BarChart from '../Main-components/Results-BarChart'

const RESULTS_SERVICE_URL = `${process.env.RESULTS_SERVICE_URL}`
const RACES_SERVICE_URL = `${process.env.RACES_SERVICE_URL}`
const QUAL_SERVICE_URL = `${process.env.QUAL_SERVICE_URL}`

class ResultsBar extends Component {

  constructor(){
    super()
    this.state = {
      results: [],
      quals: [],
      races: [],
      seasons: []
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
  }

   setDefault = (races) => {
    const uniqYears = [...new Set(races.map(d => d.season))]
    const uniqRaces = [...new Set(races.map(d => d.raceName))]
    races =  uniqRaces.map((y, index) => ({id: index, raceName:y, selected: false, key: 'races' }) )
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

  render() {

  	const{races, seasons, results, quals} = this.state

    var selectedRace = races.find(d => (d.selected === true))
    var selectedSeason = seasons.find(d => (d.selected === true))

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
            height="500" />
  	} else {
  	 	var ResultsChart = <Loading width="1200" height="450"/>
  	}

    if (races.length != 0 && seasons.length != 0)  {
      var Header = <div style={headerStyle}><h3>{selectedSeason.season} {selectedRace.raceName}</h3></div>
    } else {
      var Header = <div style={headerStyle}><h3></h3></div>
    }

      return (
  	  <div className="header">
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
  	    <div>
  	    	{ResultsChart}
  	    </div>
  	  </div>
  	);

    }

}

export default ResultsBar;