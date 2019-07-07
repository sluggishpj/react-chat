import React, { Component } from 'react';
import {connect} from 'react-redux';
import {getUserList} from '../../redux/chatuser.redux.js';
import UserCard from '../user-card/user-card.jsx';

@connect(
  state => state,
  {getUserList}
)
class Boss extends Component {
  componentDidMount() {
    console.log('getUserList genius');
    this.props.getUserList('genius');
  }
  render() {
    return <UserCard userlist = {this.props.chatuser.userlist}/>
  }
}

export default Boss;