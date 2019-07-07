import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sendMsg, updateGroupMsgRead } from '../../redux/chat.redux.js'
import { NavBar, List, InputItem, Button, Icon } from 'antd-mobile'
import './chat.scss'

@connect(
  state => state,
  { sendMsg, updateGroupMsgRead }
)
class Chat extends Component {
  constructor(props) {
    super(props)
    let targetUserID = this.props.match.params.userid
    console.log('targetUserID', targetUserID)
    this.state = {
      to: targetUserID,
      msg: ''
    }
    this.chatRef = React.createRef()
    this.inputRef = React.createRef()
  }

  componentDidMount() {
    console.log('componentDidMount')
    const chatDiv = this.chatRef.current // 获取当前聊天记录div
    const input = this.inputRef.current // 当前聊天输入框
    input.focus() // 聚焦到输入框
    this.scrollToBottom(chatDiv) // 滚动到底部
  }

  componentDidUpdate() {
    this.scrollToBottom(this.chatRef.current) // 滚动到底部
  }

  scrollToBottom(myDiv) {
    let contentHeight = myDiv.scrollHeight // 内容高度
    let divHeight = myDiv.offsetHeight // div高度
    myDiv.scrollTop = contentHeight - divHeight // 需要滚动的高度
  }

  handleSubmit() {
    this.props.sendMsg(this.state)
    this.setState({ msg: '' })
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    this.props.updateGroupMsgRead(this.state.to)
  }

  render() {
    let chat = this.props.chat
    let me = this.props.user
    let allusers = this.props.chatuser.allusers

    let targetUserID = this.props.match.params.userid
    let targetUser = allusers[targetUserID]
    let targetUserName = targetUser && targetUser.username // 对方名字
    let chatid = [me._id, targetUserID].sort().join('_')

    // 对方的通信消息
    let chatmsg = chat.chatmsg.filter(msgObj => {
      return msgObj.chatid === chatid
    })

    return (
      <div ref={this.chatRef} styleName="chat-div">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.goBack()
          }}
        >
          {targetUserName}
        </NavBar>

        {chatmsg.map(v => {
          let avatarName = allusers[v.from].avatar
          let avatar = require(`../images/${avatarName}.png`)

          return v.from !== me._id ? (
            <List key={v.create_time}>
              <List.Item wrap thumb={avatar}>
                {v.msg}
              </List.Item>
            </List>
          ) : (
            <List key={v.create_time}>
              <List.Item
                wrap
                styleName="me-chat"
                extra={<img alt={avatarName} src={avatar} />}
              >
                {v.msg}
              </List.Item>
            </List>
          )
        })}

        <div className="fixed-footer">
          <List>
            <InputItem
              ref={this.inputRef}
              placeholder="请输入"
              value={this.state.msg}
              onChange={v => {
                this.setState({ msg: v })
              }}
              extra={
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    this.handleSubmit()
                  }}
                >
                  发送
                </Button>
              }
            />
          </List>
        </div>
      </div>
    )
  }
}

export default Chat
