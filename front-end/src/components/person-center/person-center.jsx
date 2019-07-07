import React, { Component } from 'react';
import {Result, List, WhiteSpace, Button, Modal} from 'antd-mobile';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import './person-center.scss';
import {logout} from '../../redux/user.redux.js';

@connect(
  state => state.user,
  {logout}
)
class PersonCenter extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    const alert = Modal.alert;
    alert('退出', '确定要退出登录？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
      { text: '确定', onPress: () => {console.log('ok');this.props.logout()} }
    ]);

  }
  render() {
    const user = this.props;
    const Item = List.Item;
    const Brief = Item.Brief;
    return user.avatar?(
      <div>
        <Result
          img={<img src={require(`../images/${user.avatar}.png`)} 
            alt={user.username}
            styleName = 'avatar'
            />}
          title={user.username}
          message={user.company? <div>{user.company}</div>:null}
        />
        <List renderHeader={() => '简介'}>
          <Item multipleLine>
            {user.title}
            {user.desc.split('\n').map(v => (
              <Brief key={v}>{v}</Brief>
            ))}
            {user.money?<Brief>薪资:{user.money}</Brief>:null}
          </Item>
        </List>
        <WhiteSpace />

        <Button type="warning" onClick={this.logout}>退出登录</Button>
      </div>
    ):<Redirect to={user.redirectTo} />
  }
}

export default PersonCenter;