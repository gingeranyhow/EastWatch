let sqsHelpers = require('./helpers/sqs.js');
let viewsQueue = 'https://sqs.us-west-1.amazonaws.com/361175477919/EastWatch-views';
const elastic = require('../../database/elasticsearch.js');

let create_action_and_meta_data = (video_id) => {
  return {update: {
    _index: 'bettersearch', 
    _type: 'video', 
    _id: video_id
  }};
};


let updateViews = () => {
  sqsHelpers.getShortPoll(viewsQueue)
    .then(results => {
      if (!results || results.length === 0) {
        console.log('no results');
        return;
      }
      // console.log('~~~~~~ RESULTS PRE UPDATE ~~~~~ \n', results[0].Body);

      elastic.updateViews(JSON.parse(results[0].Body))
        .catch(err => console.error(err));
      
    //  setTimeout(sqsHelpers.getShortPoll.bind(null, viewsQueue), 5000);
    })
    .catch(err => {
      console.error(err);
    });
};

module.exports.updateViews = updateViews;