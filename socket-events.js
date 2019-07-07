const model = require('./model/model.js');

let userMap = new Map(); // 保存用户id及其对应的socket

module.exports = function(io) {
  io.on('connection', socket => {
    console.log('尝试连接，session', socket.session);
    let from = socket.session.uid;
    if(from) {
      console.log('连接成功');
      userMap.set(socket.session.uid, socket);

      // 这里的发送消息和接收消息都是从前端的角度
      // 发送消息
      socket.on('sendMsg', async (data) => {
        let { to, msg } = data;
        console.log('from', socket.session.uid);
        if(to !== from) {
          let chatid = [from, to].sort().join('_');
          console.log('sendMsg', data);

          try {          
            let insertDoc = await model.insertOne('chat', {
              chatid,
              from,
              to,
              msg,
              create_time: Date.now()
            });
            if (insertDoc) {
              console.log('插入数据成功', insertDoc.msg);
              // 发送给目标用户，如果对方不在线就不发了
              userMap.get(to) && userMap.get(to).emit('receiveMsg', insertDoc);
            }else {
              console.log('数据没插入哦', err);
            }
          }catch(err) {
            console.log('数据插入失败', err);
          }
        }
      });


      socket.on('disconnect', () => {
        console.log('断开啦', socket.session.uid);
        userMap.delete(socket.session.uid);
      });
    }else {
      console.log('还未登录，不让你连');
      socket.disconnect(true);
    }
  });
};