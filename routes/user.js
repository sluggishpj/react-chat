const Router = require('koa-router')
const router = new Router()
const utility = require('utility')

const model = require('../model/model.js')

// 过滤掉数据库表中一些字段
const filterObj = { pwd: 0, __v: 0 }

function failMsg(msg = '出错啦') {
  return { code: 0, msg }
}

function successMsg(data = {}, msg = '') {
  return { code: 1, data, msg }
}

// md5加密密码
function md5Pwd(pwd) {
  const salt = 'thisisasalt@#$%^*.'
  return utility.md5(utility.md5(pwd + salt))
}

// 登录
router.post('/login', async ctx => {
  const { username, pwd } = ctx.request.body
  console.log('username', username, 'pwd', pwd)
  try {
    let findDoc = await model.findOne(
      'user',
      { username, pwd: md5Pwd(pwd) },
      filterObj
    )
    if (findDoc) {
      console.log('查找登录数据成功', findDoc)
      ctx.session.uid = findDoc._id
      ctx.body = successMsg(findDoc)
    } else {
      console.log('查找登录数据失败')
      ctx.body = failMsg('用户名或密码错误')
    }
  } catch (err) {
    ctx.body = failMsg('服务器出错啦')
    console.log('err', err)
  }
})

// 注册
router.post('/register', async ctx => {
  const { username, pwd, type } = ctx.request.body
  console.log('username', username, 'pwd', pwd, 'type', type)
  try {
    let findDoc = await model.findOne('user', { username })
    if (findDoc) {
      console.log('用户名重复')
      ctx.body = failMsg('用户名重复')
      return
    } else {
      let insertDoc = await model.insertOne('user', {
        username,
        pwd: md5Pwd(pwd),
        type
      })
      if (insertDoc) {
        console.log('插入数据成功', insertDoc)
        const { username, type, _id } = insertDoc
        ctx.session.uid = _id
        ctx.body = successMsg({ username, type, _id })
      } else {
        console.log('插入数据失败')
      }
    }
  } catch (err) {
    ctx.body = failMsg('服务器出错啦')
  }
})

// 查看个人相关信息
router.get('/info', async ctx => {
  const { uid } = ctx.session
  if (uid) {
    try {
      let findDoc = await model.findOne('user', { _id: uid }, filterObj)
      console.log('查看个人信息成功', findDoc)
      ctx.body = successMsg(findDoc)
    } catch (err) {
      ctx.body = failMsg('服务器出错啦')
      console.log('err', err)
    }
  } else {
    console.log('未登录')
    ctx.body = failMsg('还没登录哦!')
  }
})

// 更新个人信息
router.post('/update', async ctx => {
  const { uid } = ctx.session
  const reqData = ctx.request.body
  if (uid) {
    try {
      let findDoc = await model.findByIdAndUpdate('user', uid, reqData)
      let data = Object.assign(
        {},
        {
          username: findDoc.username,
          type: findDoc.type
        },
        reqData
      )
      ctx.body = successMsg(data)
    } catch (err) {
      ctx.body = failMsg('服务器出错啦')
      console.log('err', err)
    }
  } else {
    ctx.body = failMsg('还没登录哦!')
  }
})

// 查看用户列表
router.get('/list', async ctx => {
  const { type } = ctx.request.query
  try {
    let doc = await model.findAll('user', { type }, filterObj)
    ctx.body = successMsg(doc)
  } catch (err) {
    ctx.body = failMsg('服务器出错啦')
    console.log('err', err)
  }
})

// 退出登录
router.post('/logout', async ctx => {
  const { uid } = ctx.session
  if (uid) {
    ctx.session = null
    ctx.body = successMsg({}, '退出登录啦')
  } else {
    ctx.body = failMsg('还没登录哦!')
  }
})

// 查看用户聊天信息
router.get('/msglist', async ctx => {
  const { uid } = ctx.session
  if (uid) {
    try {
      let findDoc = await model
        .findAll('chat', {})
        .or([{ from: uid }, { to: uid }])
      console.log('聊天信息查找结果长度', findDoc.length)
      ctx.body = successMsg(findDoc)
    } catch (err) {
      ctx.body = failMsg('服务器出错啦')
      console.log('err', err)
    }
  } else {
    ctx.body = failMsg('还没登录哦!')
  }
})

// 更新消息状态
router.post('/updateUnRead', async ctx => {
  const { uid } = ctx.session
  const from = ctx.request.body.front
  if (uid && uid !== from) {
    try {
      let findDoc = await model.updateMany(
        'chat',
        { from, to: uid },
        {
          $set: { read: true }
        }
      )
      console.log('updateUnRead', findDoc)
      ctx.body = successMsg({}, '更新消息数量成功')
    } catch (err) {
      console.log('updateUnRead err', err)
    }
  }
})

module.exports = router
