// Elastic Search Schema

module.exports.videos = {
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
        "published_at" : { "type" : "date" },
        "published_at" : { 
          "type" : "date",
          "format": "yyyy-MM-dd HH:mm:ss"
        },
        "thumbnails" : { 
          "type": "object", 
          "enabled" : false 
        },
        "channel_id" : { 
          "type" : "integer",
          "index" : "false"
        },
        "duration":  {
          "type" : "integer",
          "index" : "false"
        }
      }
    }
  }
};