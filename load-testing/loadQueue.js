/* This file supports me loading queues that 
// will eventually be populated by other microservices
*/


/* URLs */
let viewsQueue = 'https://sqs.us-west-1.amazonaws.com/361175477919/EastWatch-views';

/* Test Data Sources */
let testViewData = require('./files/viewQueue.js');

/* Helper Functions */

let populateQueueViewWithTest = (testData) => {
  let messageAttributes = {
    "count": {
      DataType: "Number",
      StringValue: testData.length.toString()
    }
  };

  sqsHelpers.addToQueue(viewsQueue, testData, messageAttributes);
};

/* Run Test Data */ 
populateQueueViewWithTest(testViewData);
