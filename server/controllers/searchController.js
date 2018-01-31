const env = process.env.NODE_ENV || "test";
const elastic = require('../../database/elasticsearch.js');
const abService = require('./helpers/abService.js');
const axios = require('axios');

let trendingEndpoint = 'http://127.0.0.1:3000/service/trending';

const index = async ctx => {
  if (!ctx.query.query) {
    ctx.throw(400, 'Badly formed request. Please include query'); 
    return;
  }

  if (ctx.query.userId) {
    let bucketId = abService(ctx.query.userId);
    console.log('placed in bucket:', bucketId);
  }

  try {
    let search = await axios.get(trendingEndpoint);
    console.log(search.data.videos);
    results = await elastic.baseSearch(ctx.query.query);
    ctx.body = {
      data: {
        count: results.length,
        items: results
      }
    }
  } catch (err) {
    ctx.status = 400
    ctx.body = `Uh-oh: ${err.message}`
    console.error('Error handler:', err.message)
  }
};


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