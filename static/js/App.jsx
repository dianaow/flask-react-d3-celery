import React from 'react'
import Header from './Header'
import Main from './Main'

import '../css/global.css';
import '../css/Axis.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faAngleUp, faAngleDown} from '@fortawesome/free-solid-svg-icons'
library.add(faCheck, faAngleUp, faAngleDown)


const App = () => (
  <div className="App">
    <Header />
    <Main />
  </div>
)

export default App
