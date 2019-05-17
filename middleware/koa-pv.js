function pv(ctx){
  ctx.session.count++
  console.log('pv+++',ctx.path)
  console.log(ctx.session.count)
}

module.exports=function(){
  return async function(ctx,next){
    pv(ctx)
    await next()
  }
}
