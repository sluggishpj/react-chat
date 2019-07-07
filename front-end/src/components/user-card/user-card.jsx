import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card, WhiteSpace} from 'antd-mobile';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import './user-card.scss';

@withRouter
@connect(
  state => state
)
class UserCard extends Component {
  static propTypes = {
    userlist: PropTypes.array.isRequired
  }

  goChat(uid) { // 跳转到聊天窗口
    this.props.history.push(`/chat/${uid}`);
  }

  render() {
    const userType = this.props.user.type; // 自身身份
    const userlist = this.props.userlist.filter(user => user.avatar);  // 有头像的用户
    return (
      <div styleName='userlist'>
        {userlist.map(user => (
          <div key={user.username} onClick={() => this.goChat(user._id)}>
            <Card>
              <Card.Header
                title={user.username}
                thumb={require(`../images/${user.avatar}.png`)}
                extra={<span>{user.title}</span>}
              />
              <Card.Body>
                {user.desc?(<div>
                  {(userType==='boss'? '个人描述：':'职位要求：')+user.desc}
                  </div>):null}
                {user.company?<div>公司：{user.company}</div> : null}
                {user.money?<div>薪资：{user.money}</div> : null}
              </Card.Body>
            </Card>
            <WhiteSpace />
          </div>
        ))}
      </div>
    )
  }
}

export default UserCard;
