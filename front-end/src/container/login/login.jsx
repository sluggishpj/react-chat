import React, { Component } from 'react';
import './login.scss';
import Logo from '../../components/logo/logo.jsx';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {login, setErrMsg} from '../../redux/user.redux.js';

import {List, InputItem, WingBlank, WhiteSpace, Button} from 'antd-mobile'

@connect(
  // 你要state什么属性放到props里
  // state => ({msg: state.user.msg})，可以在this.props.msg获取
  state=>state.user, // 返回redux文件中对应的user reducer函数中的state
  {login, setErrMsg} // 你要什么方法放到props里，自动dispatch
)
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      pwd: ''
    };
    this.goRegister = this.goRegister.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    this.props.setErrMsg('');
  }

  goRegister() { // 跳转到注册页
    this.props.history.push('/register');
  }

  handleChange(key, val) {
    this.setState({[key]:val});
  }

  handleLogin() {
    this.props.login(this.state);
  }

  render() {
    const user = this.props;
    const redirectTo = user.redirectTo;
    return (
      <div styleName='login'>
        {/*根据是否登录进行跳转*/}
        {(redirectTo && (redirectTo !== '/login'))? (<Redirect to={redirectTo} />) : null}

        <Logo />
        <h2>登录</h2>

        <WingBlank size='md'>
          <List renderHeader={user.msg}>
            <InputItem 
              placeholder='请输入用户名'
              onChange={v => {this.handleChange('username', v)}}
            >用户名</InputItem>

            <InputItem 
              placeholder='请输入密码'
              onChange={v => {this.handleChange('pwd', v)}}
            >密码</InputItem>
          </List>
          <WhiteSpace size='lg' />
          <Button type="primary" onClick={this.handleLogin}>登录</Button>
          <WhiteSpace size='lg' />
          <span styleName='go-register' onClick={this.goRegister}>去注册></span>
        </WingBlank>
      </div>
    );
  }
}

export default Login;
