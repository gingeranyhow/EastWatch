// Elastic Search Schema
// See readme for data upload

{
  "settings" : {
    "number_of_shards" : 20, 
    "number_of_replicas" : 1 
  },
  "mappings" : {
    "video" : {
      "properties" : {
        "videoId" : { 
          "type" : "long" 
        },
        "views": { 
          "type" : "long" 
        },
        "title" : { 
          "type" : "text" 
        },
        "description" : { 
          "type" : "text" 
        },
        "publishedAt" : { 
          "type" : "date",
          "format": "date_time"
        },
        "channelTitle":{
          "type" : "text"
        },
        "duration":  {
          "type" : "long",
          "index" : false
        },
        "thumbnails" : { 
          "type": "object", 
          "enabled" : false 
        }
      }
    }
  }
}

