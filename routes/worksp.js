const router = require('koa-router')()
const Redis = require('koa-redis')
const Work = require('../dbs/models/work')

const Store = new Redis().client

router.prefix('/worksp')

router.get('/', function(ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function(ctx, next) {
  ctx.body = 'this is a users/bar response'
})

router.get('/fix',async function(ctx){
  const st = await Store.hset('fix','name',Math.random())
  ctx.body={
    code:0
  }
})

router.post('/addWork', async function(ctx) {
  console.log(ctx.request.body)
  const work = new Work({name: ctx.request.body.name, type: ctx.request.body.type})
  let code
  try {
    await work.save()
    code = 0
  } catch (e) {
    code = -1
  }
  ctx.body = {
    code: code
  }
})

router.post('/getWork', async function(ctx) {
  const result = await Work.findOne({name: ctx.request.body.name})
  const results = await Work.find({name: ctx.request.body.name})
  ctx.body = {
    code: 0,
    result,
    results
  }
})

router.post('/updateWork',async function(ctx){
  const result = await Work.where({
    name: ctx.request.body.name
  }).update({
    type: ctx.request.body.type
  })
  ctx.body={
    code:0
  }
})

router.post('/removeWork',async function(ctx){
  const result = await Work.where({
    name: ctx.request.body.name
  }).remove()

  ctx.body={
    code:0
  }
})


module.exports = router
