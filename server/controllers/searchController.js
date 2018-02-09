const env = process.env.NODE_ENV || "test";
const axios = require('axios');

// Helper functions

const elastic = require('../../database/elasticsearch.js');
const toClientFormat = require('./helpers/toClientFormat.js');
const serviceEndpoints = require('./helpers/endpoint-routes.js');
const sqsSend = require('./helpers/sqs-send.js');

// My search function

const baseSearch = async ctx => {
  if (!ctx.query.query) {
    ctx.throw(400, 'Badly formed request. Please include query'); 
    return;
  }
  
  let shouldIncludeTrends = (ctx.state.bucketId === 2);
  let neededSearchResults = shouldIncludeTrends ? 7 : 10;

  let searchId = 34;

  try {
    await elastic.getQueueSize()
      .then(size => {
        if (size >= 250) {
          console.log('⚠ queue size:', size)
          throw 'Elastic search queue size too large';
        } else {
          console.log('queue size:', size)
          let trendPromise = shouldIncludeTrends 
            ? axios.get(serviceEndpoints.trendingEndpoint)
            : Promise.resolve(undefined);
    
          let searchPromise = elastic.firstSearch(ctx.query.query, neededSearchResults);
          return Promise.all([trendPromise, searchPromise])
        }
      })
      .then(([trend, search]) => {
        if (search === undefined || search.length < neededSearchResults) {
          return elastic.slowSearch(ctx.query.query, neededSearchResults)
            .then((search) => [trend, search]);
        } else {
          return [trend, search];
        }
      })
      .then(([trend, search]) => {

        if (!search || !search.length) {
          search = [];
        }
            // Format search for clients
        let formattedSearch = search.map(item => {
          return toClientFormat.elasticVideoSummaryToClient(item);
        });

        // Add trends results if existing
        if (shouldIncludeTrends) {
          formattedSearch = (trend.data.videos).concat(formattedSearch);
        }
        return formattedSearch;
      })
      .then(searchResults => {
        let response = {
            searchId: searchId,
            trends: shouldIncludeTrends,
            count: (searchResults && searchResults.length) || 0,
            items: searchResults
          }

        ctx.body = {
          data: response
        }
      })
      .then(() => {
        // Send action to Events Service
        let messageBody = {
          userId: ctx.query.userId,
          event: 'search',
          timestamp: Date.now(),
          search: {
            searchId: searchId,
            bucketId: ctx.state.bucketId || 1
          }
        };
        
        return sqsSend.addToQueue(serviceEndpoints.eventsSQS, messageBody, {});
      })
      .then((res) => console.log(res))
      .catch(err => {
        ctx.throw(500, `Error: Server error`);
        // console.error('Inner retrieving search results', err)
      });
  } catch (err) {
    ctx.throw(500, `Error: Server error`);
    // console.error('Outer retrieving search results', err);
    // return;
  }   
};

module.exports = { baseSearch };
