let sqs = require('./helpers/sqs-receive.js');
const serviceEndpoints = require('./helpers/endpoint-routes.js');
const elastic = require('../../database/elasticsearch.js');

let processEachMessage = (message) => {
  let videoArray = message.Body;
  let actionType = message.MessageAttributes.event.StringValue;
  elastic.updateElasticVideoData(JSON.parse(videoArray), actionType);
};

let startMessageBusListener = () => {
  sqs.updateAndDelete(serviceEndpoints.incomingVideoSQS, processEachMessage);
};

// startMessageBusListener();

module.exports.kickoff = startMessageBusListener;