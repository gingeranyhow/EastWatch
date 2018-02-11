require('dotenv').config();
require('newrelic');

const Koa = require('koa');
const Router = require('koa-router');
const router = new Router();
const abService = require('./controllers/helpers/abService.js');

const statsDClientModule = require('./controllers/helpers/statsDClient.js');
let statsDClient = statsDClientModule();

// Require routes
const searchRoutes = require('./routes/search.routes');
const serviceRoutes = require('./routes/service.routes');
const videoRoutes = require('./routes/video.routes');
const eventRoutes = require('./routes/event.routes');
// const viewsController = require('./controllers/viewsMessageBusController');

const app = new Koa();
const PORT = process.env.PORT || 3000;

// Middleware to add X-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();

  statsDClient.timing('.response_time', Date.now() - start, 0.25);
  ctx.set('X-Response-Time', `${Date.now() - start}ms`);
});

// Video Route (web server passthrough as of now)
app.use(videoRoutes.routes());

// Web server middleware that hydrates ctx with experiment bucket ID
app.use(async (ctx, next) => {
  const start = Date.now();
  ctx.state.bucketId = abService(ctx.query.userId);
  statsDClient.timing('.bucket.response_time', Date.now() - start, 0.25);
  await next();
})

// Events Routes (web server passthrough)
app.use(eventRoutes.routes());

// Search Routes
app.use(searchRoutes.routes());

// Kick off Message bus listeners
// Start Listener for MessageBus Queues
// let minutesInMS = 2 * 60000;
// setInterval(viewsController.updateViews, minutesInMS);

// Mounting temporary Routes to replicate other services (Delete on prod)
app.use(serviceRoutes.routes());

// Ensure a 405 Method Not Allowed is sent
app.use(router.allowedMethods())

// Start Server
const server = app.listen(PORT, () => {
    console.log(`👂 Server listening on port: ${PORT}`);
}).on("error", err => {
  console.error(err);
});

module.exports = server;