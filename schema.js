// Elastic Search Schema

PUT /bettersearch
{
  "settings" : {
    "number_of_shards" : 5, 
    "number_of_replicas" : 1 
  },
  "mappings" : {
    "video" : {
      "properties" : {
        "video_id" : { "type" : "integer" },
        "views": { "type" : "long" },
        "title" : { "type" : "text" },
        "description" : { "type" : "text" },
        "published_at" : { 
          "type" : "date",
          "format": "date_time"
        },
        "thumbnails" : { 
          "type": "object", 
          "enabled" : false 
        },
        "channel_title":{
          "type" : "text"
        },
        "channel_id" : { 
          "type" : "text",
          "index" : false
        },
        "duration":  {
          "type" : "text",
          "index" : false
        }
      }
    }
  }
}

// GET /shakespeare/_search
// { 
//   "query": {
//     "match": {
//       "text_entry": "peace"
//     }
//   }
// }

// curl -X PUT \
//   http://localhost:9200/persons/ \
//   -H 'content-type: application/json' \
//   -d '{
//     "mappings":{
//         "person":{
//             "properties":{
//                 "name":{
//                     "type":"string"
//                 },
//                 "suggest":{
//                     "type":"completion"
//                 }
//             }
//         }
//     }
// }'
// 

// Move to current folder

curl -H 'Content-Type: application/x-ndjson' -XPOST 'localhost:9200/bettersearch/video/_bulk?pretty' --data-binary @fulltest.json