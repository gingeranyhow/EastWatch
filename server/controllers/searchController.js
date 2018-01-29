const env = process.env.NODE_ENV || "test";
const elastic = require('../../database/elasticsearch.js');

const index = async ctx => {
  if (!ctx.query.query) {
    ctx.throw(500,'Error Message'); 
    return;
  }

  try {
    let query = 'peace';
    results = await elastic.baseSearch(ctx.query.query);
    ctx.body = {
      data: {
        count: results.length,
        items: results
      }
    }
  } catch (error) {
    console.error(error);
  } 
};


module.exports = { index };