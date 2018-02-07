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

// My search function
const index = async ctx => {
  if (!ctx.query.query) {
    ctx.throw(400, 'Badly formed request. Please include query'); 
    return;
  }

  // Set up variables based on experiment bucketing
  let bucketId = abService(ctx.query.userId);
  let shouldIncludeTrends = (bucketId === 2);
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
            ? axios.get(trendingEndpoint)
            : Promise.resolve(undefined);
    
          let searchPromise = elastic.firstSearch(ctx.query.query, neededSearchResults);
          return Promise.all([trendPromise, searchPromise])
        }
      })
      .then(([trend, search]) => {
        console.log('continued here');
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
        let resultsCount = (searchResults && searchResults.length) || 0
        ctx.body = {
          data: {
            searchId: searchId,
            count: resultsCount,
            items: searchResults
          }
        }
      })
      .then(() => {
        // Aftewards, process out
        // postToMessage(bucketId, ctx.query.userId);
      })
      .catch(err => {
        ctx.throw(500, `Error: Server error`);
        console.error('Inner retrieving search results', err)
      });
  } catch (err) {
    ctx.throw(500, `Error: Server error`);
    console.error('Outer retrieving search results', err);
    return;
  }   
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
    ctx.body = 'Sorry, no luck!';
  } 
};

const hello = async ctx => {
  ctx.body = 'Hello new Ginger!';
};

module.exports = { index, check, hello };
