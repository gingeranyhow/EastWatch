
// let v = { _index: 'bettersearch',
//   _type: 'video',
//   _id: '173148',
//   _score: 13.965252,
//   _source: 
//    { type: 'video',
//      videoId: 173148,
//      views: 38778,
//      title: 'Dave\'s Garage Episode 10 Pt1',
//      description: 'In this Episode I start putting "The Helmet" together.',
//      publishedAt: '2007-07-02T08:34:33.000Z',
//      channelTitle: 'iStormtrooper',
//      duration: 547615,
//      thumbnails: { default: [Object], medium: [Object], high: [Object] } } }

let elasticVideoSummaryToClient = (v) => {
  if (typeof(v._source) !== 'object') {
    return;
  }

  let source = v._source;
  return {
    videoId: source.videoId,
    views: source.views,
    title: source.title,
    description: source.description,
    publishedAt: source.publishedAt,
    channelTitle: source.channelTitle,
    duration: source.duration,
    thumbnails: source.thumbanils
  };
};


module.exports = {elasticVideoSummaryToClient};