var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({  
  host: 'localhost:9200',
  log: 'info'
});

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

let baseSearch = (input) => {  
  return client.search({
    index: 'shake*',
    body: {
      query: {
        match: {
          text_entry: input
        }
      }
    }
  })
    .then((body) => {
      var hits = body.hits.hits;
      return hits;
    })
    .catch((err) => {
      console.trace(error.message); 
    });
};

exports.baseSearch = baseSearch;