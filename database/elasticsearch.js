var elasticsearch = require('elasticsearch');

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
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

/**
* check if the index exists
*/

let indexExists = (indexName) => {  
  return client.indices.exists({
    index: indexName
  });
};

exports.indexExists = indexExists;  

/**
* check if the index exists
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

let baseSearch = (input) => {  
  return client.search({
    index: 'bettersearch',
    body: {
      query: {
        match: {
          title: input
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
exports.lookupById = lookupById;