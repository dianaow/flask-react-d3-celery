import React from 'react'
import { Switch, Route } from 'react-router-dom'
import MainDashboard from './views/MainDashboard'
import LaptimesScatter from './views/LaptimesScatter'
import ResultsBar from './views/ResultsBar'

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={MainDashboard}/>
      <Route path='/laptimes-beeswarmplot' component={MainDashboard}/>
      <Route path='/laptimes-scatterplot' component={LaptimesScatter}/>
      <Route path='/results-barchart' component={ResultsBar}/>
    </Switch>
  </main>
)

export default Main
