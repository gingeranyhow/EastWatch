require('dotenv').config();
const axios = require('axios');
const statsDClientModule = require('./helpers/statsDClient.js');
const statsDClient = statsDClientModule();
const redis = require('../../database/redis.js');

// Helper functions
const elastic = require('../../database/elasticsearch.js');
const toClientFormat = require('./helpers/toClientFormat.js');
const serviceEndpoints = require('./helpers/endpoint-routes.js');
const sqsSend = require('./helpers/sqs-send.js');

// Helper function - send message
const sendSearchEvent = async function(ctx, next) {
  let start = Date.now();
  await next();
  let messageBody = {
    userId: ctx.query.userId,
    event: 'search',
    timestamp: Date.now(),
    search: {
      searchId: 34,
      bucketId: ctx.state.bucketId || 1
    }
  };

  try {
    await sqsSend.addToQueue(serviceEndpoints.eventsSQS, messageBody, {})
  } catch (err) {
    ctx.throw(500, `Error: Server error`);
  }   
};

// My search function
const baseSearch = async function (ctx, next) {
  let start = Date.now();

  if (!ctx.query.query) {
    ctx.throw(400, 'Badly formed request. Please include query'); 
    return;
  }

  let shouldIncludeTrends = (ctx.state.bucketId === 2);
  let limit = 10;
  let searchId = 34;

  let trendPromise = shouldIncludeTrends 
    ? axios.get(serviceEndpoints.trendingEndpoint)
    : Promise.resolve(undefined);

  let searchInRedis = redis.get(ctx.query.query);

  let updateRedis = true;

  let searchPromise = async function() {
    try {
      let redisItem = await redis.get(ctx.query.query);

      if (redisItem) {
        console.log('Found in redis');    
        updateRedis = false;
        statsDClient.increment('.search.redis', 1, 0.25);
        statsDClient.timing('.search.redis.response_time',  Date.now() - start, 0.25);
        return JSON.parse(redisItem);
      } else {
        let results = await elastic.firstSearch(ctx.query.query, limit);
        if (results === undefined || results.length < limit) {
          statsDClient.increment('.search.withfallback', 1, 0.25);
          statsDClient.timing('.search.primary.response_time',  Date.now() - start, 0.25);
          results = await elastic.slowSearch(ctx.query.query, limit);
        } else {
          statsDClient.increment('.search.withoutfallback', 1, 0.25);
          // console.log('search primary success: ', ctx.query.query)
        }  

        let formattedSearch = results && results.map(item => {
          return toClientFormat.elasticVideoSummaryToClient(item);
        });  

        return formattedSearch;
      } 
    } catch (err) {
      console.error(err);
    }

    return undefined;
  }

  try {
    let [trend, search] = await Promise.all([trendPromise, searchPromise()]);
    statsDClient.timing('.search.results.response_time',  Date.now() - start, 0.25);
    // console.log('search', search);
    // let preFormatStart = Date.now();
    // Add trends results and slice to ten

    let trendVideos = shouldIncludeTrends && trend && trend.data && trend.data.videos;

    let itemsToReturn = trendVideos
      ? trendVideos.concat(search.slice(0, limit - trendVideos.length))
      : search
      
    let response = {
      searchId: searchId,
      trends: shouldIncludeTrends,
      count: (itemsToReturn && itemsToReturn.length) || 0,
      items: itemsToReturn
   }

    ctx.body = {
      data: response
    }

    // statsDClient.timing('.search.format.response_time', Date.now() - preFormatStart, 0.25);
    if (search && updateRedis) {
      console.log('updating in redis');   
      redis.update(ctx.query.query, JSON.stringify(search));
    }
    
    next();
  } catch (err) {
    console.error('here', err);
    // ctx.throw(500, `Error: Server error`);
  }
};

module.exports = { baseSearch, sendSearchEvent };



