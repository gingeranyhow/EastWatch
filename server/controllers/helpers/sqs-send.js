// Load the SDK for JavaScript
var AWS = require('aws-sdk');
require('dotenv').config();

// Set the region and credentials
var credentials = new AWS.SharedIniFileCredentials({profile: 'myCapstoneTest'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-west-1'});
AWS.config.setPromisesDependency(require('bluebird'));

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// Add Items to a particular Queue
let addToQueue = (queueUrl, messageBody, messageAttributes) => {
  var params = {
    DelaySeconds: 1,
    MessageAttributes: messageAttributes,
    MessageBody: JSON.stringify(messageBody),
    QueueUrl: queueUrl
  };

  let sendMessagePromise = sqs.sendMessage(params).promise();

  return sendMessagePromise;
};

module.exports.addToQueue = addToQueue;