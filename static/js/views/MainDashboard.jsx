import React, { Component } from 'react';
import { max, min, quantile } from 'd3-array';
import axios from 'axios'
import Dropdown from '../Shared-components/Dropdown';
import Loading from '../Shared-components/Loading';
import BeeswarmPlot from '../Main-components/Laptimes-BeeswarmPlot'

const RACES_SERVICE_URL = `${process.env.RACES_SERVICE_URL}`
const ROUNDED_LAPTIMES_SERVICE_URL = `${process.env.ROUNDED_LAPTIMES_SERVICE_URL}`

class Main extends Component {

  constructor(){
    super()
    this.state = {
      races: [],
      seasons: [],
      round_laptimes: []
    };
  }

  componentDidMount(){

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

    const roundlaptimesRequest = axios.get(ROUNDED_LAPTIMES_SERVICE_URL)
                 .then(response => {this.setState({round_laptimes: response.data.data})})
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

  filterAndSort_Laps = (selectedRace, selectedSeason, laptimes, filtQ) => {

	  var filteredLapsResults = laptimes.filter(d => (d.raceName === selectedRace.raceName && d.season === selectedSeason.season))

    if (filtQ) {
      return this.filterQuantile(filteredLapsResults)
    } else {
      return filteredLapsResults
    }

  }

  filterQuantile = (data) => {
    var upperIQR = quantile(data.map(d => d.time), 0.99)
    return data.filter(d => (d.time < upperIQR))
  }

  render() {

  	const{races, seasons, round_laptimes} = this.state

    var selectedRace = races.find(d => (d.selected === true))
    var selectedSeason = seasons.find(d => (d.selected === true))

    const headerStyle = {
      textAlign: 'left',
      fontWeight: 'bold',
      minWidth: '350px'
    }

    if (races.length != 0 && seasons.length != 0 && round_laptimes.length != 0) {
    var distPlot = 
      <BeeswarmPlot
        lapsData={this.filterAndSort_Laps(selectedRace, selectedSeason, round_laptimes, false)} 
        width="1400" 
        height="650" /> 
    } else {
      var distPlot = <Loading width="1400" height="650"/>
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
          {distPlot}
        </div>
  	  </div>
  	);

    }

}

export default Main;