const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// session和Redis
const session = require('koa-generic-session')
const Redis = require('koa-redis')

const pv = require('./middleware/koa-pv')
const m1 = require('./middleware/m1')
const m2 = require('./middleware/m2')
const m3 = require('./middleware/m3')
// 引入mongoose
const mongoose = require('mongoose')
const dbConfig = require('./dbs/config')
// 引入路由
const index = require('./routes/index')
const users = require('./routes/users')
const worksp = require('./routes/worksp')

// error handler
onerror(app)
// session加密处理
app.keys = ['keys', 'keyskeys']

// redis配置
const redisConfig = {
  port: 6379,          // Redis port
  host: '119.23.67.3',   // Redis host
  prefix: 'mtpr', //存诸前缀
  key: 'mt',
  password: 'ACElzz2018'
  // ttl: 60 * 60 * 23,  //过期时间
  // family: 4,
  // db: 0,
}
app.use(session({
  key: 'mt',
  prefix: 'mtpr',
  store: new Redis(redisConfig)
}))
// middlewares 自上而下执行中间件
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(pv())
app.use(m1())
app.use(m2())
app.use(m3())
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(worksp.routes(), worksp.allowedMethods())
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
})
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
