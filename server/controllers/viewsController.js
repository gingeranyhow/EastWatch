let sqsHelpers = require('./helpers/sqs.js');
let viewsQueue = 'https://sqs.us-west-1.amazonaws.com/361175477919/EastWatch-views';
const elastic = require('../../database/elasticsearch.js');

let updateViews = () => {
  sqsHelpers.getShortPoll(viewsQueue)
    .then(results => {
      if (!results || results.length === 0) {
        console.log('no results');
        return;
      }

      console.log('~~~~~~ RESULTS PRE UPDATE ~~~~~ \n', results[0].Body);

      elastic.updateViews(results[0].Body)
        .catch(err => console.error(err));
      
    //  setTimeout(sqsHelpers.getShortPoll.bind(null, viewsQueue), 5000);
    })
    .catch(err => {
      console.error(err);
    });
};

updateViews();

module.exports.updateViews = updateViews;