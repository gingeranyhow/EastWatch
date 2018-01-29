const env = process.env.NODE_ENV || 'test';
const elastic = require('../../database/elasticsearch.js');

const index = async ctx => {
  const { id } = ctx.params;
  if (!id) {
    ctx.throw(500,'Error Message'); 
    return;
  }

  try {
    const video = await elastic.lookupById(id);
    console.log('video:', video);

    if (!video) {
      throw new Error('The requested resource does not exists');
    }

    ctx.body = {
      data: video
    };
  } catch (error) {
    ctx.status = 404;
    ctx.body = {
      error: error.message
    };
  }
};


module.exports = { index };