
require('dotenv').config();
var AWS = require('aws-sdk');
const Consumer = require('sqs-consumer');
const serviceEndpoints = require('./endpoint-routes.js');

// Set the region and credentials
var credentials = new AWS.SharedIniFileCredentials({profile: process.env.AWS_PROFILE});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-west-1'});
AWS.config.setPromisesDependency(require('bluebird'));


// Helper function for processing and deleting messages from Queues

let updateAndDelete = (queueUrl, callback) => {
  const app = Consumer.create({
    queueUrl: queueUrl,
    messageAttributeNames: ['All'],
    batchSize: 10,
    handleMessage: (message, done) => {
      callback(message);
      done();
    },
    sqs: new AWS.SQS({apiVersion: '2012-11-05'})
  });

  app.on('error', (err) => {
    console.log(err.message);
  });
   
  app.start();
};

module.exports.updateAndDelete = updateAndDelete;

// Helper function for checking a queue without deleting.
// Primarily for tests.

let checkQueue = (queueUrl) => {
  var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
  var params = {
    AttributeNames: ['SentTimestamp'],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: ['All'],
    QueueUrl: queueUrl,
    VisibilityTimeout: 10, /* Setting this to zero causes lots of duplications */
    WaitTimeSeconds: 0
  };

  let receiveMessagePromise = sqs.receiveMessage(params).promise();
  
  return receiveMessagePromise
    .then(response => {
      console.log('~~~~ WHAT IS IN QUEUE: ~~~~');
      console.log(response.Messages);
    })
    .catch(err => console.error(err));
};

module.exports.checkQueue = checkQueue;

// TEST ACTIONS
// updateAndDelete(serviceEndpoints.testSQS, (m) => {console.log(m)});
// checkQueue(serviceEndpoints.eventsSQS);
// checkQueue(serviceEndpoints.testSQS);
