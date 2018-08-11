import React from "react";
import { Button, Col, Row } from 'react-bootstrap';
require('../css/app.css');

export default class App extends React.Component {
  render () {
    return (<Row>
              <Col md={8}>
                <svg width="300px" height="150px">
                  <rect x="20" y="20" width="20px" height="20" rx="5" ry="5" />
                  <rect x="60" y="20" width="20px" height="20" rx="5" ry="5" />
                  <rect x="100" y="20" width="20px" height="20" rx="5" ry="5"/>
                </svg>
              </Col>
              <Col md={4}>
                <h1 class='header-contents'> React + D3 Test </h1>
              </Col>
            </Row>);
  }
}