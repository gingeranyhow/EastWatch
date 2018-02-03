// Load the SDK for JavaScript
var AWS = require('aws-sdk');
require('dotenv').config();

// Set the region and credentials
var credentials = new AWS.SharedIniFileCredentials({profile: process.env.AWS_PROFILE});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-west-1'});
AWS.config.setPromisesDependency(require('bluebird'));

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// Remove Items From Queue (not exposed, only used internally)
let removeFromQueue = (queueUrl, messages) => {
  let entries = [];

  messages.forEach((message, index) => {
    let entry = {
      Id: `${message.MessageId}-${index}`,
      ReceiptHandle: message.ReceiptHandle
    };
    entries.push(entry);
  });

  let params = {
    Entries: entries,
    QueueUrl: queueUrl
  };

  let deleteMessageBatchPromise = sqs.deleteMessageBatch(params).promise();
  return deleteMessageBatchPromise;
};

// Get items from Queue with a Short Poll

let getShortPoll = (queueUrl) => {
  var params = {
    AttributeNames: [
      'SentTimestamp'
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
      'All'
    ],
    QueueUrl: queueUrl,
    VisibilityTimeout: 10, /* Setting this to zero causes lots of duplications */
    WaitTimeSeconds: 0
  };

  let receiveMessagePromise = sqs.receiveMessage(params).promise();

  return receiveMessagePromise
    .then(response => {
      if (response.Messages && response.Messages.length > 0) {
        // Found message
        // console.log('found messages:', response.Messages);
        // return removeFromQueue(queueUrl, response.Messages)
        //   .then(() => {
            return response.Messages; 
          // })
          // .catch(err => {
          //   console.error(err);
          // });
      } else {
        return response.Messages;
      }  
    });
};

module.exports.getShortPoll = getShortPoll;


// Add Items to a particular Queue

let addToQueue = (queueUrl, messageBody, messageAttributes) => {
  var params = {
    DelaySeconds: 1,
    MessageAttributes: messageAttributes,
    MessageBody: JSON.stringify(messageBody),
    QueueUrl: queueUrl
  };

  let sendMessagePromise = sqs.sendMessage(params).promise();

  return sendMessagePromise
    .then(results => {
      console.log(results);
    })
    .catch(err => {
      console.error(err);
    });
};

module.exports.addToQueue = addToQueue;

// FOR TESTING PURPOSES, VIEW QUEUE

let checkQueue = (queueUrl) => {
  var params = {
    AttributeNames: [
      'SentTimestamp'
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
      'All'
    ],
    QueueUrl: queueUrl,
    VisibilityTimeout: 10, /* Setting this to zero causes lots of duplications */
    WaitTimeSeconds: 0
  };

  let receiveMessagePromise = sqs.receiveMessage(params).promise();
  
  return receiveMessagePromise
    .then(response => {
      console.log('~~~~ QUEUE ~~~~');
      console.log(response.Messages);
    })
    .catch(err => console.error(err));
};

module.exports.checkQueue = checkQueue;



// ~~~~~~~~ BACKGROUND SEND


// var params = {
//   DelaySeconds: 1,
//   MessageAttributes: {
//     "count": {
//       DataType: "Number",
//       StringValue: "2"
//     },
//   },
//   MessageBody: JSON.stringify([{"video_id": 3423, "views": 34234},{"video_id": 3553, "views": 34234}]),
//   QueueUrl: viewsQueue
// };

// sqs.sendMessage(params, function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.MessageId);
//   }
// });

// ~~~~~~~~ BACKGROUND RETRIEVE

// var params = {
//  AttributeNames: [
//     "SentTimestamp"
//  ],
//  MaxNumberOfMessages: 1,
//  MessageAttributeNames: [
//     "All"
//  ],
//  QueueUrl: queueURL,
//  VisibilityTimeout: 0,
//  WaitTimeSeconds: 0
// };

// sqs.receiveMessage(params, function(err, data) {
//   if (err) {
//     console.log("Receive Error", err);
//   } else if (data.Messages) {
//     console.log('got this message back:', data.Messages);
//     var deleteParams = {
//       QueueUrl: queueURL,
//       ReceiptHandle: data.Messages[0].ReceiptHandle
//     };
//     sqs.deleteMessage(deleteParams, function(err, data) {
//       if (err) {
//         console.log("Delete Error", err);
//       } else {
//         console.log("Message Deleted", data);
//       }
//     });
//   }
// });
