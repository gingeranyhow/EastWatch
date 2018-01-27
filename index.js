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

router.get('/exists', (ctx, next) => {
  // ctx.body = 'Here search';
  // ctx.router available
  return elastic.indexExists('shake*')
    .then((result) => { 
      ctx.status = 200;
      ctx.body = result;
      //next();
    })
    .catch((err) => {
      console.error(err);
      ctx.body = 'Sorry, error!';
    });

  // ctx => {
  //   console.log(ctx.user);
  // };
});

router.get('/search', (ctx, next) => {
  let query = 'peace';
  // ctx.body = 'Here search';
  // ctx.router available
  return elastic.baseSearch(query)
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