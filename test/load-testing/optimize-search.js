const elastic = require('../database/elasticsearch.js');

// VERSION 1


// let testSearchTime = (query, limit) => {
  
//   let WS = elastic.queryBuilder(query, limit, 'wide')
//     .then((bodyA) => {
      
//       return 'A-> Time:' + bodyA.took + 'ms | Hits: ' + bodyA.hits.total;
//     })
//     .catch((err) => {console.error(err)});

//   let SS = elastic.queryBuilder(query, limit, 'strict')
//     .then((bodyB) => {
//       if (bodyB.hits && (bodyB.hits.total > limit)) {
//         //console.log(bodyB.took);
//         return 'B-> Time:' + bodyB.took + 'ms | Hits: ' + bodyB.hits.total;

//       } else {
//         return elastic.queryBuilder(query, limit, 'wide')
//           .then((bodyC) => {
//             //console.log(bodyC.took);
//             return 'B-> TimeC:' + (bodyB.took + bodyC.took) + 'ms | HitsC: ' + (bodyB.hits.total + bodyC.hits.total);
//           })
//           .catch(err => Promise.reject(err) );
//       }
//     })
//     .catch((err) => {
//       console.trace('Search Error Handler:', err.message); 
//     });

//   // console.log(SS());
//   // console.log(WS());
//   Promise.all([WS,SS])
//     .then(results => {
//       console.log('->Term:', query);
//       results = results.join('\n');
//       console.log(results);
//     })
//     .catch(err => console.error(err));

// };

// testSearchTime('Hawaii', 10);
// testSearchTime('Account granite', 10);
// testSearchTime('Hawaii', 10);
// testSearchTime('Hawaii', 10);
// testSearchTime('Hawaii', 10);
// testSearchTime('Hawaii', 10);
// testSearchTime('Hawaii', 10);
// testSearchTime('Hawaii', 10);
// testSearchTime('Hawaii', 10);

// testSearchTime('Nathuniya', 10);
// testSearchTime('garage', 10);
// testSearchTime('moning', 10);
// testSearchTime('how', 10);
// testSearchTime('Hawaii', 10);
// testSearchTime('on', 10);
// testSearchTime('Steel orange ', 10);
// testSearchTime('Loan', 10);
// testSearchTime('Loan Steel', 10);
// testSearchTime('Account granite', 10);
// testSearchTime('Account granite', 10);
// testSearchTime('Account granite', 10);
// testSearchTime('Account granite', 10);
// testSearchTime('Account granite', 10);
// testSearchTime('Account granite', 10);
// GET /bettersearch/video/_search

GET /bettersearch/video/_search
{   "size": 10,
    "query": {
      "function_score": {
        "query": {
            "multi_match": {
            "query": "Nathuniya",
            "minimum_should_match": "25%",
            "fields": ["title^3", "description", "channelTitle"]
        }
      },
        "field_value_factor": {
          "field": "views",
          "factor": 1,
          "modifier": "ln1p",
          "missing": 1
        }
     }
    }
 }


// // QUERY A
//  GET /bettersearch/video/_search
// {   "size": 10,
//     "query": {
//       "function_score": {
//         "query": {
//             "multi_match": {
//             "query": "Nathuniya",
//             "type": "cross_fields",
//             "fields": ["title^4", "description", "channelTitle^2"]
//         }
//       },
//         "field_value_factor": {
//           "field": "views",
//           "factor": 1,
//           "modifier": "ln1p",
//           "missing": 1
//         }
//      }
//     }
//  }


// Nathuniya
//  GET /bettersearch/video/39545

// PUT /bettersearch/video/35867
// {   "type": "video",
//           "videoId": 35867,
//           "views": 7095891,
//           "title": "Cool Mesh Dog Harness - Polka Dot Frog on Pink",
//           "description": "Nathuniya",
//           "publishedAt": "2016-02-05T20:22:23.000Z",
//           "channelTitle": "BaxterBooPets",
//           "duration": 541978,
//           "thumbnails": {
//             "default": {
//               "url": "https://i.ytimg.com/vi/AMF2JibZNcw/default.jpg",
//               "width": 120,
//               "height": 90
//             },
//             "medium": {
//               "url": "https://i.ytimg.com/vi/AMF2JibZNcw/mqdefault.jpg",
//               "width": 320,
//               "height": 180
//             },
//             "high": {
//               "url": "https://i.ytimg.com/vi/AMF2JibZNcw/hqdefault.jpg",
//               "width": 480,
//               "height": 360
//             }
//           }
//         }
//         }