// 数据库相关
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 连接mongo 并且使用chat这个集合
const DB_URL = 'mongodb://localhost:27017/chat'
mongoose.connect(DB_URL)

mongoose.connection.on('open', () => {
  console.log('数据库连接成功')
})
mongoose.connection.on('error', err => {
  console.log('数据库连接失败', err)
})
mongoose.connection.on('disconnected', () => {
  console.log('数据库连接断开')
})

// 定义集合（表结构），user表，chat表
const models = {
  user: {
    username: { type: String, require: true },
    pwd: { type: String, require: true },
    type: { type: String, require: true }, // 用户类型
    avatar: { type: String }, //头像
    desc: { type: String }, // 个人简介或者职位简介
    title: { type: String }, // 职位名
    company: { type: String }, // 如果你是boss 还有两个字段
    money: { type: String } // 薪资
  },
  chat: {
    chatid: { type: String, require: true }, // 一组对话的ID
    from: { type: String, require: true }, // 发送者
    to: { type: String, require: true }, // 接收者
    msg: { type: String, require: true, default: '' }, // 发送内容
    read: { type: Boolean, default: false }, // 是否已读
    create_time: { type: Number, default: Date.now() } // 创建时间
  }
}

for (let m in models) {
  mongoose.model(m, new Schema(models[m]))
}

// 插入一条数据，name是集合（表）名
function insertOne(name, doc) {
  const TargetModel = getModel(name)
  return TargetModel.create(doc)
}

// 插入多条数据
function insertMany(name, doc) {
  const TargetModel = getModel(name)
  return TargetModel.insertMany(doc)
}

// 删除符合条件的所有文档（行）
function deleteAll(name, conditions) {
  const TargetModel = getModel(name)
  return TargetModel.remove(conditions)
}

// 查找所有文档（行）
function findAll(name, conditions, filterObj) {
  const TargetModel = getModel(name)
  return TargetModel.find(conditions, filterObj)
}

// 查找某一文档（行）
function findOne(name, conditions, filterObj = {}) {
  const TargetModel = getModel(name)
  return TargetModel.findOne(conditions, filterObj)
}

// 根据id查找某一文档
function findById(name, id) {
  const TargetModel = getModel(name)
  return TargetModel.findById(id)
}

// 通过id查找并更新某一文档
function findByIdAndUpdate(name, id, updateObj) {
  const TargetModel = getModel(name)
  return TargetModel.findByIdAndUpdate(id, updateObj)
}

// 更新多条数据 Model.update(conditions, doc, [options], [callback])
function updateMany(name, conditions, doc, options) {
  const TargetModel = getModel(name)
  return TargetModel.updateMany(conditions, doc, options)
}

// 更新某一文档（行）
function updateOne(name, conditions, doc, options) {
  const TargetModel = getModel(name)
  return TargetModel.updateOne(conditions, doc, options)
}

function getModel(name) {
  return mongoose.model(name)
}

// deleteAll('chat', {}).then(doc => {
//     console.log('deleteAll', doc);
// });

module.exports = {
  findAll,
  findOne,
  insertOne,
  findById,
  findByIdAndUpdate,
  updateMany
}
