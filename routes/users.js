const router = require('koa-router')()
const Redis = require('koa-redis') //路由中引入redis
const Person = require('../dbs/models/person')

const Store = new Redis().client // 创建一个redis客户端

router.prefix('/users')  // 增加前缀   Suffix后缀

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})
// 不通过session设置redis的key
router.get('/fix', async function (ctx) {
  console.log('开始')
  const st = await Store.hset('fix','name',Math.random())
  console.log('结束')
  ctx.body = {
    code: 0
  }
})

// 新增
router.post('/addPerson', async function (ctx) {
  console.log(ctx.request.body)
  const person = new Person({name: ctx.request.body.name, age: ctx.request.body.age})
  let code
  try {
    await person.save()
    code = 0
  } catch (e) {
    code = -1
  }
  ctx.body = {
    code: code
  }
})
// 查看
router.post('/getPerson', async function (ctx) {
  const result = await Person.findOne({name: ctx.request.body.name})
  const results = await Person.find({name: ctx.request.body.name})
  ctx.body = {
    code: 0,
    result,
    results
  }
})
// 修改
router.post('/updatePerson', async function (ctx) {
  const result = await Person.where({
    name: ctx.request.body.name
  }).update({
    age: ctx.request.body.age
  })
  ctx.body = {
    code: 0
  }
})
// 删除
router.post('/removePerson', async function (ctx) {
  const result = await Person.where({
    name: ctx.request.body.name
  }).remove()

  ctx.body = {
    code: 0,
    result
  }
})

module.exports = router
