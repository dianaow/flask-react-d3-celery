import React from 'react'
import { ButtonToolbar, Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'

const Header = () => (
	<div>
		<h1>FORMULA 1</h1>
	    <ButtonToolbar>
	    	<ToggleButtonGroup type="radio" name="options" defaultValue={1}>
		    	<LinkContainer to="/laptimes-beeswarmplot">
					<ToggleButton value={1}>Laptimes v1</ToggleButton>
				</LinkContainer>
				<LinkContainer to="/laptimes-scatterplot">
				    <ToggleButton value={2}>Laptimes v2</ToggleButton>
				</LinkContainer>
				<LinkContainer to="/results-barchart">
				    <ToggleButton value={3}>Results</ToggleButton>
				</LinkContainer>
		    </ToggleButtonGroup>
	    </ButtonToolbar>
    </div>
)

export default Header
