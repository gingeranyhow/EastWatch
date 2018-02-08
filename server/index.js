require('newrelic');
const Koa = require('koa');
const Router = require('koa-router');
const router = new Router();
const abService = require('./controllers/helpers/abService.js');

// Require routes
const searchRoutes = require('./routes/search.routes');
const serviceRoutes = require('./routes/service.routes');
const videoRoutes = require('./routes/video.routes');

// const viewsController = require('./controllers/viewsMessageBusController');

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
  console.log(`${ctx.method} ${ctx.url} \n⤷ Response time is: ${ms}ms`);
});

// Video Route
app.use(videoRoutes.routes());

// Create middleware that adds a bucket ID onto 

// app.use(async (ctx, next) => {
//   if (ctx.query.userId) {
//     ctx.state.bucketId = abService(ctx.query.userId);
//   }
//   await next();
// })

// Search Routes
app.use(searchRoutes.routes());

// Events Routes


// Temporary Routes (Will be replaced)
app.use(serviceRoutes.routes());

// Ensure a 405 Method Not Allowed is sent
app.use(router.allowedMethods())

// Message Bus

// Start Listener for MessageBus Queues
// let minutesInMS = 2 * 60000;
// setInterval(viewsController.updateViews, minutesInMS);

// Start Server
const server = app.listen(PORT, () => {
    console.log(`👂 Server listening on port: ${PORT}`);
}).on("error", err => {
  console.error(err);
});

module.exports = server;