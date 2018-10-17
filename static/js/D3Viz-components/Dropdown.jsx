import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import onClickOutside from "react-onclickoutside";
import '../../css/global.css';

class Dropdown extends Component{
  constructor(props){
    super(props)
    this.state = {
      listOpen: false,
      headerTitle: this.props.title
    }
  }

  handleClickOutside(){
    this.setState({
      listOpen: false
    })
  }

  selectItem = (title, id, stateKey) => {
    this.setState({
      headerTitle: title,
      listOpen: false
    }, this.props.resetThenSet(id, stateKey))
  }

  toggleList = () => {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }))
  }

  render(){
    const{list} = this.props
    const{listOpen, headerTitle} = this.state
    return(
      <div className="dd-wrapper">
        <div className="dd-header" onClick={this.toggleList}>
          <div className="dd-header-title">{headerTitle}</div>
          {listOpen
            ? <FontAwesomeIcon icon="angle-up" size="sm" color="#ccc"/>
            : <FontAwesomeIcon icon="angle-down" size="sm" color="#ccc"/>
          }
        </div>
        {listOpen && <ul className="dd-list">
          {list.map((item)=> (
            <li className="dd-list-item" 
                key={item.id} 
                onClick={() => this.selectItem(item[this.props.col], item.id, item.key)}>
                  {item[this.props.col]} {item.selected && <FontAwesomeIcon icon="check" size="sm" color="#ccc"/>}
            </li>
          ))}
        </ul>}
      </div>
    )
  }
}

export default onClickOutside(Dropdown);