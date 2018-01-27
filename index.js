const Koa = require('koa');
const Router = require('koa-router');
const elastic = require('./elasticsearch.js');
const app = new Koa();
const router = new Router();
const PORT = 3000;

// response
// app.use(ctx => {
//   ctx.body = 'Hello Koa';
// });

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// testing router

// router.get('/exists', (ctx, next) => {
//   return elastic.indexExists('shake*')
//     .then((result) => { 
//       ctx.status = 200;
//       ctx.body = result;
//       //next();
//     })
//     .catch((err) => {
//       console.error(err);
//       ctx.body = 'Sorry, error!';
//     });
// });

// search handler

router.get('/search', (ctx, next) => {
  console.log(ctx.query.query);
  let query = 'peace';
  if (!ctx.query.query) {
    ctx.body = 'TODO:Handle this as a bad request error or return trending';
    return;
  }
  
  return elastic.baseSearch(ctx.query.query)
    .then((result) => { 
      ctx.body = result;
    })
    .catch((err) => {
      console.error(err);
      ctx.body = 'Sorry, error!';
    });
});



app
  .use(router.routes())
  .use(router.allowedMethods());
 
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;