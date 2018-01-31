var elasticsearch = require('elasticsearch');
const toElastic = require('./elasticFormatter.js');

var client = new elasticsearch.Client({  
  host: 'localhost:9200',
  log: 'info'
});

let index = 'bettersearch';
let type = 'video';

client.ping({
  requestTimeout: 30000,
}, function (error) {
  if (error) {
    console.error('➺ Elasticsearch cluster is down!');
  } else {
    console.log('➺ Elastic: All is well');
  }
});

/**
* check if the index exists
*/

let indexExists = () => {  
  return client.indices.exists({
    index: index
  });
};

exports.indexExists = indexExists;  

/**
* Find By ID
*/

let lookupById = (id) => {
  return client.get({
    index: index,
    type: 'video',
    id: id
  })
    .then(body => {
      let video = body._source;
      return body._source;
    })
    .catch(err => {
      console.trace(err.message); 
    });
};

exports.lookupById = lookupById;

/**
* Search By Query
*/

let baseSearch = (query) => {  
  return client.search({
    index: 'bettersearch',
    body: {
      query: {
        match: {
          title: query
        }
      }
    }
  })
    .then((body) => {
      var hits = body.hits.hits;
      return hits;
    })
    .catch((err) => {
      console.trace(err.message); 
    });
};

exports.baseSearch = baseSearch;

/**
* Update Items
*/

let updateViews = (queueMessages) => {
  // Expecting an array like ['video_id': 1234, 'views': 1232];
  console.log('~~~ updating views in database ~~~');
  let updateData = toElastic.updateViews(queueMessages);
  console.log('~~~ formatted ~~~', updateData);
  return client.bulk({
    body: updateData
  })
    .catch(err => {
      console.error(err);
    });
};

exports.updateViews = updateViews;


