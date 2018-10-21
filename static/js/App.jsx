import React from "react";
import { Col, Row } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrophy, faCarCrash, faWrench, faTimesCircle, faCheck, faAngleUp, faAngleDown} from '@fortawesome/free-solid-svg-icons'
import Results from './Results-components/Results';

library.add(faTrophy, faCarCrash, faWrench, faTimesCircle, faCheck, faAngleUp, faAngleDown)

export default class App extends React.Component {
  render () {
    return (
      <div className="App">
          <Row>
              <Results />
          </Row>
      </div>
    )
  }
}