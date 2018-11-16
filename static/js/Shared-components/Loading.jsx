import React,{ Component, Fragment } from 'react';

export default class Loading extends Component {

  render() {

    return (
    	<svg width={this.props.width} height={this.props.height}>
    	    <style>
    			{'.heavy { font: bold 30px black; fontSyle: Nunito Sans, textAlign: center; textAnchor: middle }'}
    		</style>
    		<text x="600" y="250" className='heavy'>Loading...</text>
    	</svg>
    )
  }
}
