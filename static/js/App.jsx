import React from "react";
import { Col, Row } from 'react-bootstrap';
import Races from './Races';
import '../css/app.css';

export default class App extends React.Component {
  render () {
    return (<Row>
              <Col md={8}>
                <h1 className='header-content'> React + D3 Test </h1>
                <Races />
              </Col>
              <Col md={4}>
              </Col>
            </Row>);
  }
}