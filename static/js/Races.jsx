import React,{ Component } from 'react';
import fetch from 'isomorphic-fetch';
import RacesViz from './RacesViz';

const RACE_SERVICE_URL = 'https://]ocalhost:8080/data/races/all';

class Races extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          races: []};
        this.processResults = this.processResults.bind(this);  
    }

    componentDidMount(){
      fetch(RACE_SERVICE_URL) 
        .then(results => results.json()) 
        .then(data => this.setState({ races: data }));
    }

    processResults(data) {

      const raceId_arr = data.map(d => d.raceId);
      const season_arr = data.map(d => d.season);
      const raceName_arr = data.map(d => d.raceName);
      const url_arr = data.map(d => d.url);
      const data_mapped = {'raceId': raceId_arr, 'season': season_arr, 'raceName': raceName_arr, 'url': url_arr};


      return data_mapped;
      // this.setState({
      //   races: data_mapped 
      // }, () => console.log(this.state))
        
    }

    render() {
        const title = 'Race Tracks';

         const processedData = this.processResults(this.state.races);
           
        return(  <div>
                  <h2>{title}</h2>
                  <RacesViz data= {processedData} />
                </div>);
    }
}

export default Races;