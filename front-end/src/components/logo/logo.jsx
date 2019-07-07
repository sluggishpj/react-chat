import React, { Component } from 'react';
import logo from './logo.svg';
import './logo.scss';

class Logo extends Component {
  render() {
    return (
      <div styleName="logo-container">
        <img src={logo} styleName="logo-img" alt="logo" />
      </div>
    );
  }
}

export default Logo;
