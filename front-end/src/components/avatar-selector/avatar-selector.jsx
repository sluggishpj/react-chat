import React, { Component } from 'react';
import {Grid} from 'antd-mobile';
import PropTypes from 'prop-types';
import './avatar-selector.scss';

class AvatarSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  static defaultProps = {
    selectAvatar: PropTypes.func.isRequired
  }

  render() {
    // 将图片名转换为图片数组
    const avatarList = 'boy,girl,man,woman,bull,chick,crab,hedgehog,hippopotamus,koala,lemur,pig,tiger,whale,zebra'.split(',').map(name => {
      return {
        icon: require(`../images/${name}.png`),
        text: name
      }
    });

    // 显示选择的图片
    let subTitle = this.state.text? 
      (<div styleName="avatar-header">已选择：<img src={this.state.icon} alt={this.state.text}/></div>):(<div styleName="avatar-header">请选择头像</div>);

    return (
      <div>
        <div className="sub-title">{subTitle}</div>
        <Grid data={avatarList} 
          columnNum={5} 
          onClick={avatar => {
          this.props.selectAvatar(avatar.text);
          this.setState(avatar)
        }}/>
      </div>
    )
  }
}

export default AvatarSelector;
