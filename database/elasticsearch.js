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
    console.log('✓ Elastic DB responsive');
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

// let widequery = (query) => {
//   return {
//     multi_match: {
//       query: query,
//       type: "cross_fields",
//       fields: ["title^2", "description", "channelTitle"]
//     }
//   };
// };


// let strictquery = (query) => {
//   return {
//     multi_match: {
//       query: query,
//       operator: "and",
//       fields: ["title^2", "channelTitle"]
//     }
//   };
// }

let queryBuilder = (query, limit, type = 'wide') => {
  let field_value_factor = {
    field: "views",
    factor: 1,
    modifier: "ln1p",
    missing: 1
  };

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
        fields: ["title^2", "description", "channelTitle"]
      }
    };
  }

  return client.search({
    index: 'bettersearch',
    body: {
      size: limit,
      query: {
        "function_score": {
          query: queryParam,
          field_value_factor: field_value_factor
        }
      }
    }
  });
};

let baseSearch = (query, limit) => { 
  console.log('hi');
  console.time('⚡⚡ combined query ⚡⚡');
  let strictSearch = queryBuilder(query, limit, 'strict');


  return strictSearch
    .then((body) => {
      console.log('➺ single query took: ', body.took, 'ms');

      if (body.hits && (body.hits.total > limit)) {
        console.timeEnd('⚡⚡ combined query ⚡⚡');
        return body.hits.hits;
      } else {
        let wideSearch = queryBuilder(query, limit, 'wide');

        return wideSearch
          .then((body) => {
            console.log('➺ single query took: ', body.took, 'ms');
            console.timeEnd('⚡⚡ combined query ⚡⚡');
            return body.hits.hits;
          })
          .catch(err => Promise.reject(err) );
      }
    })
    .catch((err) => {
      console.trace('Search Error Handler:', err.message); 
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


