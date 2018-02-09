/* This file supports me loading queues that other people will later support*/

const serviceEndpoints = require('../../server/controllers/helpers/endpoint-routes.js');
const sqsSend = require('../../server/controllers/helpers/sqs-send.js');
const sqsReceive = require('../../server/controllers/helpers/sqs-receive.js');
let myQueue = serviceEndpoints.incomingVideoSQS;
let testQueue = serviceEndpoints.testSQS;

/* Test Data Sources */
let updateVid = [
  {"videoId": 1234, "views": 10000},
  {"videoId": 22, "views": 14},
  {"videoId": 679, "views": 303432},
  {"videoId": 1553, "views": 3432},
  {"videoId": 3353, "views": 1000},
  {"videoId": 3753, "views": 666},
  {"videoId": 3753, "title": "noway"},
  {"videoId": 3553, "views": 78},
  {"videoId": 3953, "views": 9999999},
];

let createVid = [{
  "videoId": 1234, 
  "views": 10000,
  "title": "bananazzzzzzzzzzzzzzzz",
  "description": "bananazzzzzzzzzzzzzzzz"
}];

let deleteVid = [
  {"videoId": 1234}
];

/* Helper Functions */

let populateQueueViewWithTest = (testData, type) => {
  let messageAttributes = {
    "event": {
      DataType: "String",
      StringValue: type
    }
  };

  sqsSend.addToQueue(myQueue, testData, messageAttributes)
    .then(results => console.log(results))
    .catch(err => console.error(err));
};

/* Run Test Data */ 
// populateQueueViewWithTest(updateVid, 'update');
// populateQueueViewWithTest(deleteVid, 'delete');
// populateQueueViewWithTest(createVid, 'create');

sqsReceive.checkQueue(testQueue);

