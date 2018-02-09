const sqs = require('./helpers/sqs-send.js');
const serviceEndpoints = require('./helpers/endpoint-routes.js');

const index = async ctx => {
  try {
    let messageBusBody = ctx.request.body;
    if (messageBusBody.search) {
      messageBusBody.search.bucketId = ctx.state.bucketId || 1;
    }

    if (!ctx.request.body.event) {
      ctx.status = 400;
      ctx.body = 'Event action must include an event type.';
      return;
    }

    let response = await sqs.addToQueue(serviceEndpoints.eventsSQS, messageBusBody, {});

    if (response) {
      ctx.body = {
        acknowledged: true
      }
    }
  } catch (err) {
    console.log(err);
    ctx.throw(500, 'Issue locating queue');
  }
  
};

module.exports = { index };
