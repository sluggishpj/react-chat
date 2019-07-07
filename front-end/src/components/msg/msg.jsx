import React, { Component } from 'react';
import {List, Badge} from 'antd-mobile';
import {connect} from 'react-redux';

@connect(
  state => state
)
class Msg extends Component {
  render() {
    let chat = this.props.chat;
    let me = this.props.user;
    let allusers = this.props.chatuser.allusers;

    const Item = List.Item;
    const Brief = Item.Brief;

    let chatGroup = new Map(); // 聊天各组信息
    chat.chatmsg.forEach(v => {
      let old = chatGroup.get(v.chatid);
      let unread = old? old.unread:0;
      if( v.to === me._id && !v.read ) {unread++;}
      chatGroup.set(v.chatid, {...v, unread: unread});
    });

    // 按接收日期排序
    let msgs = [...chatGroup].sort((a, b) => {
      return b[1].create_time - a[1].create_time;
    });

    return (
      <div>
        <List>
          {msgs.map(v => {
            let frontId = v[1].from === me._id? v[1].to : v[1].from;
            // 对方是谁
            return (
              <Item
                key={v[1].create_time}
                thumb={require(`../images/${allusers[frontId].avatar}.png`)}
                extra={<Badge text={v[1].unread} />}
                onClick={() => {this.props.history.push(`/chat/${frontId}`)}}
              >
                {allusers[frontId].username}
                <Brief>{v[1].msg}</Brief>
              </Item>
            )
          })}
        </List>
      </div>
    )
  }
}

export default Msg;