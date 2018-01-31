const env = process.env.NODE_ENV || "test";
const axios = require('axios');

// Helper functions

const elastic = require('../../database/elasticsearch.js');
const abService = require('./helpers/abService.js');
const toClientFormat = require('./helpers/toClientFormat.js')
let trendingEndpoint = 'http://127.0.0.1:3000/service/trending';

const index = async ctx => {

  if (!ctx.query.query) {
    ctx.throw(400, 'Badly formed request. Please include query'); 
    return;
  }

  let bucketId = abService(ctx.query.userId);

  try {
    let shouldIncludeTrends = (bucketId === 2)

    let trendPromise = shouldIncludeTrends 
      ? axios.get(trendingEndpoint)
      : Promise.resolve(undefined);
    
    let searchResultsLimit = shouldIncludeTrends 
      ? 7
      : 10;

    let searchPromise = elastic.baseSearch(ctx.query.query, searchResultsLimit);

    const [trend, searchUnformatted] = await Promise.all([trendPromise, searchPromise])

    let formattedSearch = searchUnformatted.map((item) => {
      return toClientFormat.elasticVideoSummaryToClient(item);
    });

    if (trend) {
      formattedSearch = (trend.data.videos).concat(formattedSearch);
    }

    ctx.body = {
      data: {
        count: formattedSearch.length,
        results: formattedSearch,
        hasTrends: shouldIncludeTrends
      }
    }

    
  } catch (err) {
    ctx.status = 400
    ctx.body = `Error: ${err.message}`
    console.error('Error handler:', err.message)
  }
};

// const post = async function *(ctx, next) {
//   yield next;
//   setTimeout(function() { console.log('processed'); }, 5000);
// }


// Check that the bettersearch Index is up. Can disable pre-production

const check = async ctx => {
  try {
    let query = 'peace';
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