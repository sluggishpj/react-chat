import React, {Component} from 'react';
import api from '../../fetch/api.js';

import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {loadData} from '../../redux/user.redux.js';
import {connectAndHandleSocket} from '../../redux/chat.redux.js';

@withRouter
@connect(
  state => state,
  {loadData, connectAndHandleSocket}
)
class AuthRoute extends Component { 
    componentDidMount() {
        const publicPaths = ['/login', '/register']; // 不用跳转的路径
        const pathname = this.props.location.pathname;
        if(publicPaths.includes(pathname)) {
            return null;
        }else {
            api.getUserInfo()
              .then(res => {
                if(res.status === 200) {
                  if(res.data.code === 1) {
                    // 已是登录状态
                    this.props.loadData(res.data.data);
                    this.props.connectAndHandleSocket();
                    console.log('已登录', res.data.data);
                    this.props.history.push(this.props.user.redirectTo);
                  }else {
                    // 未登录
                    console.log('未登录');
                    this.props.history.replace('/login');
                  }
                }
              }).catch(err => {
                console.log('服务器出错啦', err);
                this.props.history.replace('/login');
              });
        }
    }
    render() {
        return null;
    }
}

export default AuthRoute;
