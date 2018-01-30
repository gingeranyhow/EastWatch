const Koa = require('koa');
const searchRoutes = require('./routes/search.routes');
const videoRoutes = require('./routes/video.routes');
// const viewsController = require('./controllers/viewsController');

const app = new Koa();
const PORT = process.env.PORT || 3000;

// X-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// Logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// Routes
app.use(searchRoutes.routes());
app.use(videoRoutes.routes());

// Start intervals for MessageBus
// 2 minute for testing. Increase to every 30 minutes. 
// let longInterval = 2 * 60000;
// setInterval(viewsController.updateViews, longInterval);

// Start Server
const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
}).on("error", err => {
  console.error(err);
});


module.exports = server;


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