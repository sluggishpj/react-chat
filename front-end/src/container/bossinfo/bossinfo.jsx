import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  NavBar,
  InputItem,
  TextareaItem,
  Button,
  WhiteSpace,
  Toast
} from "antd-mobile";

import "./bossinfo.scss";
import { updateUserInfo } from "../../redux/user.redux.js";
import AvatarSelector from "../../components/avatar-selector/avatar-selector.jsx";

@connect(
  state => state.user,
  { updateUserInfo }
)
class BossInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: "",
      title: "",
      company: "",
      money: "",
      desc: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(key, val) {
    console.log("key", key, "val", val);
    this.setState({ [key]: val });
  }

  handleSubmit() {
    // 提交更新信息
    if (this.state.avatar === "") {
      Toast.info("头像不能为空哦", 2);
    } else if (this.state.title.trim() === "") {
      Toast.info("职位名称不能为空哦", 2);
    } else if (this.state.money.trim() === "") {
      Toast.info("薪资不能为空哦", 2);
    } else if (this.state.desc.trim() === "") {
      Toast.info("职位要求不能为空哦", 2);
    } else {
      this.props.updateUserInfo(this.state);
    }
  }

  render() {
    const pathname = this.props.location.pathname;
    const redirect = this.props.redirectTo;
    console.log("pathname", pathname);
    console.log("redirect", redirect);
    return (
      <div className="has-fixed-header">
        {redirect &&
          (redirect === pathname ? null : <Redirect to={redirect} />)}

        <NavBar mode="dark" className="fixed-header">
          招聘者完善信息页
        </NavBar>

        <AvatarSelector
          selectAvatar={imgname => {
            this.handleChange("avatar", imgname);
          }}
        />
        <WhiteSpace />

        <InputItem
          placeholder="输入职位名称"
          onChange={v => {
            this.handleChange("title", v);
          }}
        >
          招聘职位
        </InputItem>
        <InputItem
          placeholder="输入公司名称"
          onChange={v => {
            this.handleChange("company", v);
          }}
        >
          公司名称
        </InputItem>
        <InputItem
          placeholder="输入职位薪资"
          onChange={v => {
            this.handleChange("money", v);
          }}
        >
          职位薪资
        </InputItem>
        <TextareaItem
          title="职位要求"
          rows={2}
          placeholder="输入职位要求"
          autoHeight
          onChange={v => {
            this.handleChange("desc", v);
          }}
        />

        <WhiteSpace />
        <Button type="primary" onClick={this.handleSubmit}>
          提交
        </Button>
      </div>
    );
  }
}

export default BossInfo;
