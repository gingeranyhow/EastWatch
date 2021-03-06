/* 
This file creates a simple /trending response
for testing purposes. Once the trend services is working
this file can be retired
*/ 

const trend = async ctx => {
  const { count } = ctx.query;

  // if (!count) {
  //   ctx.throw(400, 'Badly formed request. Please include count'); 
  //   return;
  // }

  let thumbnails = {"default":{"url":"https://i.ytimg.com/vi/S2H3bF2UvkA/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/S2H3bF2UvkA/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/S2H3bF2UvkA/hqdefault.jpg","width":480,"height":360}};

  ctx.body = {
    count: 3, 
    videos: [{
      videoId: 2,
      views: 10000000,
      title: "What is the best Mac keyboard?",
      description: "What is the best Mac keyboard you can buy? Is it Apple's Magic Bluetooth Wireless Keyboard or the Apple Wired USB Keyboard with Numeric Keypad? What are the best alternative Mac keyboards?...",
      publishedAt: "2017-04-01T04:15:58.000Z",
      channelTitle: "FIRECALL",
      duration: 6666666,
      thumbnails: thumbnails
    },
    {
      videoId: 100,
      views: 10000000,
      title: "Designer Bluetooth Desktop Keyboard Review (Microsoft)",
      description: "Another video is amazoing",
      publishedAt: "2017-05-01T04:15:58.000Z",
      channelTitle: "Johnny",
      duration: 1232412,
      thumbnails: thumbnails
    },
    {
      videoId: 500000,
      views: 10000000,
      title: "Garage time",
      description: "Slither.io walkthrough",
      publishedAt: "2013-04-01T04:15:58.000Z",
      channelTitle: "Party Bus Central",
      duration: 1244412,
      thumbnails: thumbnails
    }]
  };
};

const video = async ctx => {
  const { videoId } = ctx.query;

  // Fake missing video
  if (videoId === '6666666666666') {
    ctx.throw(404, 'No video found'); 
    return;
  } 

  ctx.body = {
    video: {
      videoId: parseInt(videoId),
      views: 10000000,
      title: "What is the best Mac keyboard?",
      description: "What is the best Mac keyboard you can buy? Is it Apple's Magic Bluetooth Wireless Keyboard or the Apple Wired USB Keyboard with Numeric Keypad? What are the best alternative Mac keyboards?...",
      publishedAt: "2017-04-01T04:15:58.000Z",
      channelTitle: "FIRECALL",
      duration: 6666666,
      videoUrl: "http://video.com"
    }
  }
};

const hello = async ctx => {
  ctx.body = 'Hello new Ginger!';
};

module.exports = { trend, video, hello};
