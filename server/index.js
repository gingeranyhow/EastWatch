require('newrelic');
const Koa = require('koa');
const Router = require('koa-router');
const router = new Router();

// Require routes

const searchRoutes = require('./routes/search.routes');
const serviceRoutes = require('./routes/service.routes');

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
  console.log(`${ctx.method} ${ctx.url} \n⤷ Response time is: ${ms}ms`);
});

// Create middleware that adds a bucket ID onto 
// the user

// Routes
app.use(searchRoutes.routes());

// Temporary Routes that 
// create fake endpoints
app.use(serviceRoutes.routes());

// Start Listener for MessageBus Queues

// let minutesInMS = 2 * 60000;
// setInterval(viewsController.updateViews, minutesInMS);

// Ensure a 405 Method Not Allowed is sent
app.use(router.allowedMethods())


// Start Server
const server = app.listen(PORT, () => {
    console.log(`👂 Server listening on port: ${PORT}`);
}).on("error", err => {
  console.error(err);
});

module.exports = server;