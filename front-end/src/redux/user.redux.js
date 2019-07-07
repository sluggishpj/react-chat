import api from '../fetch/api.js';
import { getRedirectPath } from '../util/util.js';

import {connectAndHandleSocket, removeSocket} from './chat.redux.js';

const AUTH_SUCCESS = 'AUTH_SUCCESS';
const LOAD_DATA = 'LOAD_DATA';
const LOGOUT = 'LOGOUT';
const ERROR_MSG = 'ERROR_MSG';

// 初始化数据
const initState = {
  redirectTo: '',
  msg: '',
  username: '',
  type: ''
};


// reducer
function user(state = initState, action) {
  switch (action.type) {
    case AUTH_SUCCESS: // 认证成功
      return {
        ...state,
        msg: '',
        ...action.payload,
        redirectTo: getRedirectPath(action.payload)
      };
    case ERROR_MSG: // 错误消息提醒
      return { ...state, msg: action.msg };
    case LOAD_DATA: // 加载数据
      return {
        ...state,
        ...action.payload,
        redirectTo: getRedirectPath(action.payload)
      };
    case LOGOUT: // 退出登录
      return {
        ...initState,
        redirectTo: '/login'
      };

    default:
      return state
  }
}




// action-creator
// 登录/注册/获取用户信息成功提醒

// 错误消息提醒
function  errorMsg(msg) {
    console.log('出错啦', msg);
    return { msg, type: ERROR_MSG };
};

function authSuccess(data) {
  return { type: AUTH_SUCCESS, payload: data };
}

// 保存服务器返回的数据
function loadData(data) {
  return { type: LOAD_DATA, payload: data };
}

// 退出登录
function logoutCreator() {
  return {type: LOGOUT};
}


// action
// 设置错误提醒文字
function setErrMsg(msg) {
  return dispatch => {
    dispatch(errorMsg(msg));
  }
}

// 登录
function login({ username, pwd }) {
  if (!username.trim() || !pwd.trim()) {
    return errorMsg('用户名或密码不能为空');
  }
  return dispatch => {
    api.login({ username, pwd })
      .then(res => {
        if (res.status === 200 && res.data.code === 1) {
          console.log('登录成功', res);
          dispatch(authSuccess(res.data.data));
          dispatch(connectAndHandleSocket());
        } else {
          console.log(res);
          dispatch(errorMsg(res.data.msg));
        }
      }).catch(err => {
        dispatch(errorMsg(`请求发不出去，请重试, ${err}`));
      });
  };
}

// 注册
function register({ username, pwd, repeatpwd, type }) {
  if (!username.trim() || !pwd.trim() || !repeatpwd.trim() || !type.trim()) {
    return errorMsg('用户名和密码和类型不能为空');
  }
  if (pwd.trim() !== repeatpwd.trim()) {
    return errorMsg('两次输入的密码不一致');
  }
  return dispatch => {
    api.register({ username, pwd, type })
      .then(res => {
        if (res.status === 200 && res.data.code === 1) {
          console.log('注册成功', res);
          dispatch(authSuccess(res.data.data));
          dispatch(connectAndHandleSocket);
        } else {
          dispatch(errorMsg(res.data.msg));
        }
      }).catch(err => {
        dispatch(errorMsg(`请求发不出去，请重试, ${err}`));
      });
  }
}

// 更新个人信息
function updateUserInfo(data) {
  return dispatch => {
    api.updateUserInfo(data)
      .then(res => {
        if (res.status === 200 && res.data.code === 1) {
          console.log('update success', res);
          dispatch(authSuccess(res.data.data))
        } else {
          dispatch(errorMsg(res.data.msg));
        }
      }).catch(err => {
        dispatch(errorMsg(`请求发不出去，请重试, ${err}`));
      });
  }
}

// 退出
function logout() {
  return (dispatch) => {
    api.logout()
      .then(res => {
        console.log('退出成功', res);
        dispatch(removeSocket());
        dispatch(logoutCreator());
      }).catch(err => {
        dispatch(errorMsg(`请求发不出去，请重试, ${err}`));
      })
  }
}

export {
  user,
  setErrMsg,
  login,
  register,
  loadData,
  updateUserInfo,
  logout
};