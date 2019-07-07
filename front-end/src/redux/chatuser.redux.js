import api from '../fetch/api.js';

const USER_LIST = 'USER_LIST';
const ALL_USERS = 'ALL_USERS';

const initState = {
  userlist:[], // 对方所有人
  allusers: {} // 本人加上对方所有人
};

// reducer
function chatuser(state = initState, action) {
  switch(action.type) {
    case USER_LIST:
      return {
        ...state, 
        userlist: action.payload
      };
    case ALL_USERS:
      return {
        ...state,
        allusers: action.payload
      };
    default: 
      return state;
  }
}


// action-creator
function setUserList(data) {
  return {type: USER_LIST, payload: data};
}

function setUsersAll(data) {
  return {type: ALL_USERS, payload: data};
}

// action
// 获取用户列表
function getUserList(type) {
  return (dispatch, getState) => {
    api.getUserList(type)
      .then(res => {
        if(res.status === 200) {
          if(res.data.code === 1) {
            let userlist = res.data.data;
            console.log('getUserList', userlist);

            let allusers = {}; // 保存所有用户
            [...userlist, getState().user].forEach(v => {
              allusers[v._id] = v;
            });

            dispatch(setUserList(userlist));
            dispatch(setUsersAll(allusers))
          }else {
            console.log('出错啦', res.data.msg);
          }
        }
      }).catch(err => {
        console.log('请求发不出去，请重试');
        console.log('axios getUserList err', err);
      });
  }
}


export {
  chatuser,
  getUserList
}