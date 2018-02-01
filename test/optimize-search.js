// VERSION 1


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

 GET /bettersearch/video/_search
{   "size": 10,
    "query": {
      "function_score": {
        "query": {
            "multi_match": {
            "query": "Nathuniya",
            "type": "cross_fields",
            "fields": ["title^4", "description", "channelTitle^2"]
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


/Nathuniya

 GET /bettersearch/video/39545

   

PUT /bettersearch/video/35867
{   "type": "video",
          "videoId": 35867,
          "views": 7095891,
          "title": "Cool Mesh Dog Harness - Polka Dot Frog on Pink",
          "description": "Nathuniya",
          "publishedAt": "2016-02-05T20:22:23.000Z",
          "channelTitle": "BaxterBooPets",
          "duration": 541978,
          "thumbnails": {
            "default": {
              "url": "https://i.ytimg.com/vi/AMF2JibZNcw/default.jpg",
              "width": 120,
              "height": 90
            },
            "medium": {
              "url": "https://i.ytimg.com/vi/AMF2JibZNcw/mqdefault.jpg",
              "width": 320,
              "height": 180
            },
            "high": {
              "url": "https://i.ytimg.com/vi/AMF2JibZNcw/hqdefault.jpg",
              "width": 480,
              "height": 360
            }
          }
        }
        }