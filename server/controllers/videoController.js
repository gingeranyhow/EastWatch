const axios = require('axios');
const serviceEndpoints = require('./helpers/endpoint-routes.js');

const getVideo = async ctx => {
  const videoId = ctx.params.videoId;
  
  if (!videoId || !parseInt(videoId)) {
    ctx.throw(404, 'Badly formed request. Please include valid video id'); 
    return;
  }

  let results = await axios.get(serviceEndpoints.videoEndpoint, {params: {videoId: videoId}})
    .then((results)=> {
      return results.data;
    })
    .catch(err => {
      if (err.response.status === 404) {
        ctx.throw(err.response.status, 'Video not found');
      } else {
        ctx.throw(500);
      }
    });

  ctx.body = {
    data: results
  }
  
};

module.exports = { getVideo };
