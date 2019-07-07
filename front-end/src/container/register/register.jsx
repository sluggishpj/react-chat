import React, { Component } from 'react';
import './register.scss';
import Logo from '../../components/logo/logo.jsx';
import {connect} from 'react-redux';
import {register, setErrMsg} from '../../redux/user.redux.js';
import {Redirect} from 'react-router-dom';

import {List, InputItem, WingBlank, WhiteSpace, Button, Radio} from 'antd-mobile'

@connect(
  state => state.user,
  {register, setErrMsg}
)
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      pwd: '',
      repeatpwd: '',
      type: 'genius' // 或boss
    }

    this.handleRegister = this.handleRegister.bind(this);
    this.goLogin = this.goLogin.bind(this);
  }

  componentDidMount() {
    this.props.setErrMsg('');
  }

  handleChange(key, val) {
    this.setState({[key]:val});
  }

  handleRegister() {
    this.props.register(this.state);
  }

  goLogin() {
    this.props.history.push('/login');
  }

  render() {
    const RadioItem = Radio.RadioItem;
    const redirectTo = this.props.redirectTo;
    return (
      <div styleName='register'>
        {/*根据是否登录进行跳转*/}
        {(redirectTo && (redirectTo !== '/login'))? <Redirect to={this.props.redirectTo} /> : null}
        
        <Logo />
        <h2>注册</h2>

        <WingBlank size='md'>
          <List renderHeader={this.props.msg}>
            <InputItem 
              placeholder='请输入用户名'
              onChange={v => {this.handleChange('username', v)}}
            >用户名</InputItem>

            <InputItem 
              placeholder='请输入密码'
              onChange={v => {this.handleChange('pwd', v)}}
            >密码</InputItem>

            <InputItem 
              placeholder='确认密码'
              onChange={v => {this.handleChange('repeatpwd', v)}}
            >确认密码</InputItem>

            <RadioItem
              checked={this.state.type === 'genius'}
              onChange={()=>this.handleChange('type','genius')}
            >求职者</RadioItem>

            <RadioItem
              checked={this.state.type === 'boss'}
              onChange={()=>this.handleChange('type','boss')}
            >招聘者</RadioItem>

          </List>
          <WhiteSpace size='lg' />
          <Button type="primary" onClick={this.handleRegister}>注册</Button>
          <WhiteSpace size='lg' />
          <span styleName='go-login' onClick={this.goLogin}>去登录></span>
        </WingBlank>
      </div>
    );
  }
}

export default Register;
