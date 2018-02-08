
let create_action_and_meta_data = (video_id) => {
  return {update: {
    _index: 'bettersearch', 
    _type: 'video', 
    _id: video_id
  }};
};

let buildElasticUpdateObjects = (arrayOfVideoViews) => {
  //input format
  // array of videos and views
  // [{videoId: 23, views: 12324}, {videoId: 27, views: 34223} ]
  let exportable = [];

  arrayOfVideoViews.forEach(item => {
    let action_and_meta_data = create_action_and_meta_data(item.videoId);
    let optional_source = {doc: {views: item.views}};
    exportable.push(action_and_meta_data);
    exportable.push(optional_source);
  });

  return exportable; 
};

module.exports.buildElasticUpdateObjects = buildElasticUpdateObjects;