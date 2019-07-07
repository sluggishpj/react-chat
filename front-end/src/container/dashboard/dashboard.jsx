import React, { Component } from 'react';
import {TabBar, NavBar} from 'antd-mobile';
import {connect} from 'react-redux';
import {Route, Switch, Redirect} from 'react-router-dom';

import Boss from '../../components/boss/boss.jsx';
import Genius from '../../components/genius/genius.jsx';
import Msg from '../../components/msg/msg.jsx';
import PersonCenter from '../../components/person-center/person-center.jsx';

@connect(
  state => state
)
class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'blueTab'
    };
  }

  render() {
    const user = this.props.user;
    const chat = this.props.chat;

    let navList = [
      {
        path:'/boss',
        text:'求职人员',
        icon:'boss',
        title:'求职人员列表',
        component:Boss,
        hide:user.type==='genius'
      },
      {
        path:'/genius',
        text:'招聘人员',
        icon:'job',
        title:'招聘人员列表',
        component:Genius,
        hide:user.type==='boss'
      },
      {
        path:'/msg',
        text:'消息',
        icon:'msg',
        title:'消息列表',
        component:Msg
      },
      {
        path:'/me',
        text:'我',
        icon:'user',
        title:'个人中心',
        component:PersonCenter
      }
    ];

    // 过滤掉隐藏的tab，比如在boss界面里，不应该显示boss的tab
    navList = navList.filter(tab => !tab.hide); 

    const {pathname} = this.props.location;
    const redirectTo = user.redirectTo;
    const publicPaths = [`/${user.type}`, '/msg', '/me']; // 不用跳转的路径

    let targetNav = navList.find(tab=>tab.path===pathname);

    return (
      <div className='has-fixed-header has-fixed-footer'>
        {/*根据是否登录进行跳转*/}
        {redirectTo && publicPaths.includes(pathname)? null: <Redirect to={redirectTo} /> }

        {/*固定头部*/}
        <NavBar mode='dark' className='fixed-header'>{targetNav && targetNav.title}</NavBar>

        <Switch>
          {navList.map(tab => (
            <Route key={tab.path} path={tab.path} component={tab.component} />
          ))}
        </Switch>


        {/*底部固定条*/}
        <div className='fixed-footer'>
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
          >
            {navList.map(tab => (
              <TabBar.Item
                badge={tab.path === '/msg'? chat.unread: 0}
                title={tab.text}
                key={tab.path}
                icon={{uri: require(`./images/${tab.icon}.png`)}}
                selectedIcon={{uri: require(`./images/${tab.icon}-active.png`)}}
                selected={tab.path === pathname}
                onPress={() => {
                  (tab.path!==pathname) && this.props.history.push(tab.path);
                }}
              >
              </TabBar.Item>
            ))}
          </TabBar>
        </div>
      </div>
    )
  }
}

export default DashBoard;
