import React, { Component } from 'react';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import './App.scss';
import AuthRoute from './components/auth-route/auth-route.jsx';
import Login from './container/login/login.jsx';
import Register from './container/register/register.jsx';
import BossInfo from './container/bossinfo/bossinfo.jsx';
import GeniusInfo from './container/geniusinfo/geniusinfo.jsx';
import Chat from './components/chat/chat.jsx';
import Dashboard from './container/dashboard/dashboard.jsx';
import reducers from './redux/reducers.js';

const store = createStore(reducers, compose(
  applyMiddleware(thunk),
  window.devToolsExtension? window.devToolsExtension(): f=>f
));


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <AuthRoute></AuthRoute>
            <Switch>
              <Route exact path='/' to='/login' />
              <Route path='/bossinfo' component={BossInfo}></Route>
              <Route path='/geniusinfo' component={GeniusInfo}></Route>
              <Route path='/login' component={Login}></Route>
              <Route path='/register' component={Register}></Route>
              <Route path='/chat/:userid' component={Chat}></Route>  
              <Route component={Dashboard}></Route>
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
