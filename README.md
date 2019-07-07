## 前提
* 电脑已安装好了node.js，mongodb

## 运行
* 开发环境下

```bash
$ npm start
```

* 生产成生产环境代码

```bash
$ npm run build
```


## 前端项目开发流程记录
### 初始化
* 使用`create-react-app`初始化项目

```bash
$ cnpm install -g create-react-app
$ create-react-app my-app
```

* 运行`npm run eject`弹出配置文件

### 配置React使之支持scss和css modules
* 安装`sass-loader`和`node-sass`

```bash
$ cnpm install sass-loader node-sass --save-dev
```

* 修改config目录下的webpack.config.dev.js，添加scss的处理项

```js
{
  test: /\.scss$/,
  use: [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 2,
        modules: true, // 启用CSS模块
        localIdentName: '[name]_[local]-[hash:base64:5]' // 生成的类名格式
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebookincubator/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          autoprefixer({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9', // React doesn't support IE8 anyway
            ],
            flexbox: 'no-2009',
          }),
        ],
      },
    },
    {
      loader: require.resolve('sass-loader')
    }
  ]
}
```


* 修改config目录下的webpack.config.prod.js，添加scss的处理项

```js
{
  test: /\.scss$/,
  loader: ExtractTextPlugin.extract(
    Object.assign(
      {
        fallback: {
          loader: require.resolve('style-loader'),
          options: {
            hmr: false,
          },
        },
        use: [
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 2,
              modules: true, // 启用CSS模块
              localIdentName: '[name]_[local]-[hash:base64:5]' // 生成的类名格式
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          {
            loader: require.resolve('sass-loader')
          }
        ],
      },
      extractTextPluginOptions
    )
  ),
}
```


* 安装`babel-plugin-react-css-modules`和`postcss-scss`

```bash
$ cnpm install babel-plugin-react-css-modules postcss-scss --save-dev
```

* 修改config目录下的webpack.config.dev.js和webpack.config.prod.js配置文件中新增配置

```js
// Process JS with Babel.
{
  test: /\.(js|jsx|mjs)$/,
  include: paths.appSrc,
  loader: require.resolve('babel-loader'),
  options: {
    
    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables caching results in ./node_modules/.cache/babel-loader/
    // directory for faster rebuilds.
    cacheDirectory: true,

    // 新增的配置
    plugins: [
      [
        'react-css-modules',
        {
          filetypes: {
            '.scss': {
              syntax: 'postcss-scss'
            }
          },
          generateScopedName: '[name]_[local]-[hash:base64:5]'
        }
      ]
    ]
  },
},
```

然后可以直接使用styleName，格式如下

```jsx
import React from 'react';
import './table.scss';

export default class Table extends React.Component {
  render () {
    return <div styleName='table'>
      <div styleName='row'>
        <div styleName='cell'>A0</div>
        <div styleName='cell'>B0</div>
      </div>
    </div>;
  }
}
```


### 安装react开发相关包
* `react-router-dom`：路由
* `redux`, `react-redux`, `redux-thunk`：状态管理

```bash
$ cnpm install react-router-dom redux react-redux redux-thunk --save 
```

### 安装 `antd-mobile` UI库

```bash
$ cnpm install antd-mobile --save
```


### 按需加载，装饰器语法
* 安装 `babel-plugin-import`，`babel-plugin-transform-decorators-legacy`

```bash
$ cnpm install babel-plugin-import babel-plugin-transform-decorators-legacy --save-dev
```

在package.json中babel中添加plugins

```js
"babel": {
  "presets": [
    "react-app"
  ],
  "plugins": [
    [
      "import",
      {
        "libraryName": "antd",
        "libraryDirectory": "es",
        "style": "css"
      }
    ],
    "transform-decorators-legacy" // 支持装饰器语法
  ]
},
```


### 代理转发请求
* 在front-end中的package.json中添加proxy选项

```js
"proxy": "http://localhost:9090"
```


### 发送http请求
* 安装axios

```bash
$ cnpm install axios --save
```

### 使用PropTypes进行类型检查

* 安装`prop-types`

```bash
$ cnpm install prop-types --save
```


### 实时应用框架socket.io前端部分

```bash
$ cnpm install socket.io-client --save
```


## 后端项目开发流程记录

### 安装依赖包
* `koa`：Web开发框架
* `koa-bodyparser`：请求解析中间件
* `koa-session`：session处理中间件
* `koa-router`：路由处理中间件
* `mongoose`：操作处理mongodb数据库
* `utility`：处理密码加密
* `socket.io`：实时应用框架
* `koa-static`：静态文件中间件

## 遇到的问题
### session问题
* 问题描述： 在ctx.session上设置唯一标识时，键名不能以下划线开始，否则无法传递，原因未知

```js
ctx.session.uid = _id; // 正常
ctx.session._uid = _id; // 异常
```


### 让socket可以获取session
* 问题描述：在socket.io连接时无法获取session
* 解决方法：

```js
const http = require('http');
const Koa = require('koa');
const session = require('koa-session');

const app = new Koa();
const server = http.createServer(app.callback());

// socket.io相关处理
const io = require('socket.io')(server);
io.use((socket, next) => { // 使之支持从socket获取session
    let error = null;
    try {
        // create a new (fake) Koa context to decrypt the session cookie
        let ctx = app.createContext(socket.request, new http.OutgoingMessage());
        socket.session = ctx.session;
    }catch(err) {
        error = err;
    }
    return next(error);
});

// 使用
io.on('connection', socket => {
    console.log('可以获取session了', socket.session);
    // ...
});
```
> 来源：https://medium.com/@albertogasparin/sharing-koa-session-with-socket-io-8d36ac877bc2



### 复用socket

* login/register/authroute认证用户后，需新建socket连接并监听相应的事件
* 需要用到socket的有：接收信息，发送信息
* logout退出登录后需断开服务器连接

共用socket，将socket保存在redux的state中

```js
// 接收消息
function receiveMsg() {
  console.log('订阅接收消息');
  return (dispatch, getState) => {
    const socket = getState().chat.socket;
    socket.on('receiveMsg', data => {
      console.log('receiveMsg', data);
      dispatch(msgReceive(data));
    });
  };
}

// 建立socket连接并注册监听事件
function connectAndHandleSocket() {
  return dispatch => {
    const socket = io('ws://localhost:9090');
    socket.on('connect', () => {
      console.log('客户端连上了');
      dispatch(saveSocket(socket)); // 保存连接的socket
      dispatch(getMsgList()); // 获取消息列表
      dispatch(receiveMsg()); // 接收消息
    });
    socket.on('disconnect', () => {
      console.log('客户端断开了');
    });
  }
}
```


