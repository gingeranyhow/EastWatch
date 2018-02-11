require('dotenv').config();
const axios = require('axios');
const statsDClientModule = require('./helpers/statsDClient.js');
let statsDClient = statsDClientModule();

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
  // console.log('start search:', start);

  if (!ctx.query.query) {
    ctx.throw(400, 'Badly formed request. Please include query'); 
    return;
  }

  let shouldIncludeTrends = (ctx.state.bucketId === 2);
  let neededSearchResults = shouldIncludeTrends ? 7 : 10;
  let searchId = 34;

  let trendPromise = shouldIncludeTrends 
    ? axios.get(serviceEndpoints.trendingEndpoint)
    : Promise.resolve(undefined);

  let searchPromise = elastic.firstSearch(ctx.query.query, neededSearchResults)
    .then((results) => {  
      if (results === undefined || results.length < neededSearchResults) {
        statsDClient.increment('.search.withfallback', 1, 0.25);
        console.log('search fallback success: ', ctx.query.query);
        return elastic.slowSearch(ctx.query.query, neededSearchResults)
      } else {
        statsDClient.increment('.search.withoutfallback', 1, 0.25);
        console.log('search primary success: ', ctx.query.query)
        return results;
      }
    });

  try {
    let [trend, search] = await Promise.all([trendPromise, searchPromise]);
    statsDClient.timing('.search.results.response_time',  Date.now() - start, 0.25);
    let preFormatStart = Date.now();
    let formattedSearch = search.map(item => {
      return toClientFormat.elasticVideoSummaryToClient(item);
    });

    // Add trends results if existing
    if (shouldIncludeTrends) {
      formattedSearch = (trend.data.videos).concat(formattedSearch);
    }
       
    let response = {
      searchId: searchId,
      trends: shouldIncludeTrends,
      count: (formattedSearch && formattedSearch.length) || 0,
      items: formattedSearch
    }

    ctx.body = {
      data: response
    }
    // console.log('Search body complete:', start);
    statsDClient.timing('.search.format.response_time', Date.now() - preFormatStart, 0.25);
    next();
    // Send action to Events Service
  } catch (err) {
    ctx.throw(500, `Error: Server error`);
  }
};

module.exports = { baseSearch, sendSearchEvent };



