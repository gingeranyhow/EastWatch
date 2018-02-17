# EastWatch - Video Search Microservice

Search microservice designed for low-latency full-text search across multiple fields. Backed by ElasticSearch. Updates and deletes handled via SQS Message Bus. 

## Boundaries
Microservice: 
- publishes client-facing search endpoint
- writes search-relevant events to SQS for Events service
- handles video updates, creates, deletes via SQS

## Tech Stack
- Koa-backed Node server, deployed to AWS EC2
- ElasticSearch
- Redis
- Testing: Mocha/Chai with Instanbul for coverage
- Monitoring: New Relic, StatsD 

# Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)

## Usage

> Some usage instructions

## Testing

> Loading queue `node data_generation/loadQueue.js`
> Check Queue `node server/controllers/helpers/test.js` 
> Update & Delete `node server/controllers/helpers/test.js` 

## Setting up Elastic Search

In Kibana delete search: 
`DELETE /bettersearch`

Add new mappings ()
`PUT /bettersearch`
...followed by the schema.js JSON object

Can also curl:
```curl -X PUT \
 http://localhost:9200/bettersearch/ \
 -H 'content-type: application/json' \
 -d ``` 
...followed by mappings

Upload data

`curl -H 'Content-Type: application/x-ndjson' -XPOST 'localhost:9200/bettersearch/video/_bulk?pretty' --data-binary @v2.json`

Test
```GET /bettersearch/_search
 { 
    "query": {
      "match": {
       "title": "peace"
     }
   }
 }```

## Requirements

- Node 6.9.x
- Redis 3.2.x
- Postgresql 9.6.x
- etc

## Other Information

(TODO: fill this out with details about your project. Suggested ideas: architecture diagram, schema, and any other details from your app plan that sound interesting.)

