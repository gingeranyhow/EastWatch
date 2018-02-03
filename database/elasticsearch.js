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

  console.time('⚡⚡ fast query ⚡⚡');

  return queryBuilder(query, limit, 'strict')
    .then((body) => {
      if (body.hits) { 
        return body.hits.hits;
      } else {
        return [];
      }
    })
    .then((hits) =>{
      console.timeEnd('⚡⚡ fast query ⚡⚡');
      return hits;
    })
    .catch(err => {
      // console.timeEnd('⚡⚡ fast query ⚡⚡');
      console.error('Fast search Error Handler:', err.message); 
    });
};

let slowSearch = (query, limit) => { 

  console.time('⚡⚡ slow query ⚡⚡');

  return queryBuilder(query, limit, 'cut')
    .then((body) => {
      if (body.hits) {
        return body.hits.hits;
      } else {
        return [];
      }
    })
    .then((hits) =>{
      console.timeEnd('⚡⚡ slow query ⚡⚡');
      return hits;
    })
    .catch(err => {
      console.error('Slow search Error Handler:', err.message); 
    });
};

exports.slowSearch = slowSearch;
exports.firstSearch = firstSearch;


/**
* Update Items
*/

let updateViews = (queueMessages) => {
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


// else { // type wide
//     queryParam = {
//       multi_match: {
//         query: query,
//         type: "cross_fields",
//         fields: ["title^2", "description", "channelTitle"]
//       }
//     };
//   }


// let oldSearch = (query, limit) => {

//   console.time('⚡⚡ query ⚡⚡');
//   let wideSearch = queryBuilder(query, limit, 'wide');
  
//   return wideSearch
//     .then((body) => {
//       console.log('➺ ES query took: ', body.took, 'ms');
//       console.timeEnd('⚡⚡ query ⚡⚡');
//       return body.hits.hits;
//     })
//     .catch((err) => {
//       console.trace('Search Error Handler:', err.message); 
//     });
// };

// let baseSearch = (query, limit) => { 

//   console.time('⚡⚡ combined query ⚡⚡');
//   let strictSearch = queryBuilder(query, limit, 'strict');

//   return strictSearch
//     .then((body) => {
//       console.log('➺ single query took: ', body.took, 'ms');

//       if (body.hits && (body.hits.total > limit)) {
//         console.timeEnd('⚡⚡ combined query ⚡⚡');
//         return body.hits.hits;
//       } else {
//         let wideSearch = queryBuilder(query, limit, 'wide');

//         return wideSearch
//           .then((body) => {
//             console.log('➺ single second query took: ', body.took, 'ms');
//             console.timeEnd('⚡⚡ combined query ⚡⚡');
//             return body.hits.hits;
//           })
//           .catch(err => {
//             Promise.reject(err);
//             console.time('⚡⚡ combined query ⚡⚡'); 
//           });
//       }
//     })
//     .catch((err) => {
//       console.trace('Search Error Handler:', err.message); 
//       console.time('⚡⚡ combined query ⚡⚡');
//     });
// };
// cuttSearch