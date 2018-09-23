import React,{ Component } from 'react';
import BarChart1 from './BarChart1'

const RACES_SERVICE_URL = `${process.env.RACES_SERVICE_URL}`

class Races extends Component {
  constructor(props) {
    super(props);
    this.state = {
      races: []};
  }

  componentDidMount(){
    fetch(RACES_SERVICE_URL)
      .then(results => results.json()) 
      .then(data => this.setState({ races: data.data }));
    
  }

  render() {
      const title = 'Race Tracks';
      const data = this.state.races;
      console.log(data);
      return (
        <div>
          <h2>{title}</h2>
          <BarChart1 data={data} />
        </div>

      );
  }
}

export default Races;