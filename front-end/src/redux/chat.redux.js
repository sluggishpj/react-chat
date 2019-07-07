import io from 'socket.io-client';
import {Toast} from 'antd-mobile';
import api from '../fetch/api.js';

const SAVE_SOCKET = 'SAVE_SOCKET';
const REMOVE_SOCKET = 'REMOVE_SOCKET';
const RECEIVE_MSG = 'RECEIVE_MSG';
const SEND_MSG = 'SEND_MSG';
const MSG_LIST = 'MSG_LIST';
const MSG_UNREAD = 'MSG_UNREAD';

const initState = {
  chatmsg: [], // 保存我参与的聊天的所有消息
  unread: 0, // 未读消息总数
  socket: ''
};


// reducer
function chat(state = initState, action) {
  switch (action.type) {
    case SAVE_SOCKET: // 保存socket
      return {
        ...state,
        socket: action.payload
      };
    case REMOVE_SOCKET: { // 移出socket
      state.socket.close(); // 关闭socket连接
      return {
        ...state,
        socket: ''
      };
    }
    case RECEIVE_MSG:
      return {...state, chatmsg:[...state.chatmsg, action.payload], unread: state.unread+1};
    case SEND_MSG:
      return {...state, chatmsg:[...state.chatmsg, action.payload]};
    case MSG_LIST:
      return {...state, chatmsg:[...action.payload]};
    case MSG_UNREAD:
      return {...state, unread: action.payload};

    default: return state;
  }
}


// action-creator
// 保存socket
function saveSocket(socket) {
  return {type: SAVE_SOCKET, payload: socket};
}

// 断开socket
function removeSocket() {
  return {type: REMOVE_SOCKET};
}

function msgReceive(msg) {
  return {type: RECEIVE_MSG, payload: msg};
}

function msgSend(msg) {
  return {type: SEND_MSG, payload: msg};
}

function msgList(msglist) {
  return {type: MSG_LIST, payload: msglist};
}

function updateUnRead(num) {
  return {type: MSG_UNREAD, payload: num}
}

// action
// 建立socket连接并注册监听事件
function connectAndHandleSocket() {
  return dispatch => {
    const socket = io('ws://localhost:9090');
    socket.on('connect', () => {
      console.log('客户端连上了');
      Toast.success('连上服务器啦', 1);
      dispatch(saveSocket(socket)); // 保存连接的socket
      dispatch(getMsgList()); // 获取消息列表
      dispatch(receiveMsg()); // 接收消息
    });
    socket.on('disconnect', () => {
      Toast.fail('和服务器失去联系啦', 2);
      console.log('客户端断开了');
    });
  }
}


// 发送消息
function sendMsg({ to, msg }) {
  return (dispatch, getState) => {
    const user = getState().user;
    const chat = getState().chat;
    const socket = chat.socket; // 连接上的socket
    const from = user._id; // 本人
    let chatid = [from, to].sort().join('_');
    console.log('sendMsg', {to, msg});
    socket.emit('sendMsg', { to, msg });
    dispatch(msgSend({chatid, from, to, msg, read: false, create_time: Date.now()}));
  }
}

// 接收消息
function receiveMsg() {
  console.log('订阅接收消息');
  return (dispatch, getState) => {
    const socket = getState().chat.socket;
    socket.on('receiveMsg', data => {
      console.log('receiveMsg', data);
      dispatch(msgReceive(data));
    });
  };
}

// 查看消息列表
function getMsgList() {
  console.log('查看消息列表');
  return (dispatch, getState) => {
    api.getMsgList()
      .then(res => {
        if(res.status === 200) {
          if(res.data.code === 1) {
            console.log('msgList', res.data.data);
            dispatch(updateUnRead(allUnreadLen(res.data.data, getState().user._id)));
            dispatch(msgList(res.data.data));
          }
        }
      });
  }
}

// 更新各组消息是否已读
function updateGroupMsgRead(front) {
  return (dispatch, getState) => {
    let meId = getState().user._id;

    api.updateUnRead(front)
      .then(res => {
        console.log('updateUnRead', res.data);
      }).catch(err => {
        console.log('updateUnRead', err);
      });

    let msgs = getState().chat.chatmsg;
    msgs = msgs.map(msg => {
      msg = Object.assign({}, msg);
      if(msg.from === front && msg.to === meId) {
        msg.read = true;
      }
      return msg;
    });
    console.log('msgs', msgs);
    dispatch(updateUnRead(allUnreadLen(msgs, meId)));
    dispatch(msgList(msgs));
  }
}


// 计算全部未读消息个数
function allUnreadLen(msgs, meId) {
    let unread = 0;
    msgs.forEach(v => {
      v.to === meId && (v.read || unread++);
    });
    return unread;
}


export {
  chat,
  sendMsg,
  connectAndHandleSocket,
  removeSocket,
  updateGroupMsgRead
};
