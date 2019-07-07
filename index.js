const http = require('http')
const path = require('path')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const router = require('koa-router')()
const logger = require('koa-logger')

const app = new Koa()
const server = http.createServer(app.callback())

/*
socket.io相关处理
 */
const io = require('socket.io')(server)
io.use((socket, next) => {
    // 使之支持从socket获取session
    let error = null
    try {
        // create a new (fake) Koa context to decrypt the session cookie
        let ctx = app.createContext(socket.request, new http.OutgoingMessage())
        socket.session = ctx.session
    } catch (err) {
        error = err
    }
    return next(error)
})

require('./socket-events.js')(io)

app.use(bodyParser())
app.use(logger())
app.use(require('koa-static')(path.resolve('front-end/build')))

/*
session相关处理
 */
app.keys = ['some secret hurr']

const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** (boolean) httpOnly or not (default true) */
    signed: true,
    /** (boolean) signed or not (default true) */
    rolling: false,
    /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false
    /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
}

app.use(session(CONFIG, app))

/*
路由相关
 */
const user = require('./routes/user.js')
const notFound = require('./routes/not-found.js')

router.use('/user', user.routes(), user.allowedMethods())
router.use('*', notFound.routes(), user.allowedMethods())

// 响应
app.use(router.routes(), router.allowedMethods())

app.on('error', err => {
    console.log('server error', err)
    logger.error('server error', err)
})

server.listen(9090, function() {
    console.log('server listen in 9090')
})