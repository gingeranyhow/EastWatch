const env = process.env.NODE_ENV || "test";
const axios = require('axios');

// Helper functions

const elastic = require('../../database/elasticsearch.js');
const abService = require('./helpers/abService.js');
const toClientFormat = require('./helpers/toClientFormat.js')
let trendingEndpoint = 'http://127.0.0.1:3000/service/trending';

// Probably will move this to another file
// This is posting to the Events queue

const postToMessage = (bucketId, query) => {
 //  setTimeout(function() { console.log('this represents me sending something to a message queue', bucketId, query); }, 5000);
}

// My search functions

const index = async ctx => {
  if (!ctx.query.query) {
    ctx.throw(400, 'Badly formed request. Please include query'); 
    return;
  }

  // Set up variables based on experiment bucketing
  let bucketId = abService(ctx.query.userId);
  let shouldIncludeTrends = (bucketId === 2);
  let searchResultsLimit = shouldIncludeTrends ? 7 : 10;

  // Later, change this to hashing
  let searchId = 34;
  let formattedSearch;

  try {
    // Set up search and trending promises
    let trendPromise = shouldIncludeTrends 
      ? axios.get(trendingEndpoint)
      : Promise.resolve(undefined);
    
    let searchPromise = elastic.firstSearch(ctx.query.query, searchResultsLimit);

    if (shouldIncludeTrends) {
      let trendPromise = axios.get(trendingEndpoint);
    }

    const [trend, searchUnformatted] = await Promise.all([trendPromise, searchPromise])

    if (!searchUnformatted || searchUnformatted.length < searchResultsLimit) {
      try {
        const [searchUnformatted] = await elastic.slowSearch(ctx.query.query, searchResultsLimit);
      } catch (err) {
        ctx.throw(500, `Error: ${err.message}`); 
        console.error('Error handler:', err.message)
      }
    }

    formattedSearch = searchUnformatted && searchUnformatted.map((item) => {
      return toClientFormat.elasticVideoSummaryToClient(item);
    });

    if (shouldIncludeTrends) {
      formattedSearch = (trend.data.videos).concat(formattedSearch);
    }

  } catch (err) {
    ctx.throw(500, `Error: ${err.message}`); 
    console.error('Error handler:', err.message)
  }

  ctx.body = {
    data: {
      searchId: searchId,
      count: formattedSearch.length || 0,
      items: formattedSearch
    }
  }
  // Aftewards, process out
  postToMessage(bucketId, ctx.query.userId);
    
};

// Check that the bettersearch Index is up. Can disable pre-production

const check = async ctx => {
  try {
    results = await elastic.indexExists();
    ctx.body = {
      status: {
        index: results
      }
    }
  } catch (error) {
    console.error(error);
    ctx.body = 'Sorry, error!';
  } 
};

module.exports = { index, check };