
module.exports = {
  // REAL // eventsSQS: 'https://sqs.us-west-1.amazonaws.com/736880112034/TheRavens', /* Andrew's queue */
  eventsSQS: 'https://sqs.us-west-1.amazonaws.com/917829210676/test-events-queue',
  testSQS: 'https://sqs.us-west-1.amazonaws.com/917829210676/test-events-queue', /* Ginger's test queue */
  incomingVideoSQS: 'https://sqs.us-west-1.amazonaws.com/917829210676/Eastwatch-videoupdates',
  videoEndpoint: 'http://127.0.0.1:3000/service/video', /* TO REPLACE w/ Matt */
  trendingEndpoint: 'http://127.0.0.1:3000/service/trending' /* TO REPLACE w/ Will */
};