import React from "react";
import { Col, Row } from 'react-bootstrap';
import Races from './Races-components/Races';
import Results from './Results-components/Results';
import '../css/global.css';
import '../css/axis.css';

export default class App extends React.Component {
  render () {
    return (
      <div className="App">
          <Row>
            <Col md={8}>
              <Results />
            </Col>
            <Col md={4}>
              <Races />  
            </Col>
          </Row>
      </div>
    )
  }
}