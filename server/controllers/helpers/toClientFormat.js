

let elasticVideoSummaryToClient = (v) => {
  if (typeof(v._source) !== object) {
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