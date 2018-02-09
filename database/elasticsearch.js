require('dotenv').config();
const elasticsearch = require('elasticsearch');
const toElastic = require('./elasticFormatter.js');

let environment = process.env.ENVIR || 'production';

let url = (environment === 'production')
  ? process.env.ES_URL
  : 'localhost:9200';

var client = new elasticsearch.Client({  
  host: url,
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
    console.log('✓ Elastic DB responsive');
  }
});


/**
* get queuesize
*/

let getQueueSize = () => {
  let params = {
    format: 'json',
    h: 'id, queue', 
    // v: true, verbose includes headers
    threadPoolPatterns: 'search'
  };

  return client.cat.threadPool(params)
    .then(body =>{
      let queue = body && body[0] && body[0].queue;
      return parseInt(queue);
    })
    .catch(err => console.error(err));
};

exports.getQueueSize = getQueueSize;  

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
      console.error(err.message); 
    });
};

exports.lookupById = lookupById;

/**
* Search By Query
*/

let queryBuilder = (query, limit, type = 'wide') => {
  let queryParam;
  if (type === 'strict') {
    queryParam = {
      multi_match: {
        query: query,
        operator: "and",
        fields: ["title^2", "channelTitle"]
      }
    };
  } else {
    queryParam = {
      multi_match: {
        query: query,
        type: "cross_fields",
        "cutoff_frequency" : 0.05,
        fields: ["title^2", "channelTitle", "description"]
      }
    };
  };

  let field_value_factor = {
    field: "views",
    factor: 1,
    modifier: "ln1p",
    missing: 1
  };

  return client.search({
    index: 'bettersearch',
    body: {
      size: limit,
      query: {
        "function_score": {
          query: queryParam //,
          // field_value_factor: field_value_factor
        }
      }
    }
  });
};

let firstSearch = (query, limit) => { 

  console.time(`⚡⚡ fast query ${query}`);
  
  return queryBuilder(query, limit, 'strict')
    .then((body) => {
      if (body.hits) { 
        return body.hits.hits;
      } else {
        return [];
      }
    })
    .then((results) =>{
      console.timeEnd(`⚡⚡ fast query ${query}`);
      return results;
    })
    .catch(err => {
      console.timeEnd(`⚡⚡ fast query ${query}`);
      console.error('Fast search Error Handler:', err.message); 
    });
};

let slowSearch = (query, limit) => { 

  // console.time(`⚡⚡ second query ${query}`);

  return queryBuilder(query, limit, 'cut')
    .then((body) => {
      if (body.hits) {
        return body.hits.hits;
      } else {
        return [];
      }
    })
    .then((results) => {
      //  console.timeEnd(`⚡⚡ second query ${query}`);
      return results;
    })
    .catch(err => {
      // console.timeEnd(`⚡⚡ second query ${query}`);
      console.error('Slow search Error Handler:', err.message); 
    });
};

exports.slowSearch = slowSearch;
exports.firstSearch = firstSearch;

/**
* Update Video Items in Database
*/

let updateElasticVideoData = (videoArray, action) => {
  let updateData = toElastic.buildElasticUpdateObjects(videoArray, action);
  return client.bulk({
    body: updateData
  })
    .catch(err => {
      console.error(err);
    });
};

exports.updateElasticVideoData = updateElasticVideoData;