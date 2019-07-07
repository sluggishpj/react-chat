import React, { Component } from 'react';
import {connect} from 'react-redux';
import {getUserList} from '../../redux/chatuser.redux.js';
import UserCard from '../user-card/user-card.jsx';

@connect(
  state => state.chatuser,
  {getUserList}
)
class Genius extends Component {
  componentDidMount() {
    console.log('getUserList boss');
    this.props.getUserList('boss');
  }
  render() {
    return <UserCard userlist={this.props.userlist} />
  }
}

export default Genius;