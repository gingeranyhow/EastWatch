
let create_action_and_meta_data = (video_id, action) => {
  if (action) {
    return {[action]: {
      _index: 'bettersearch', 
      _type: 'video', 
      _id: video_id
    }};
  }
};

let buildElasticUpdateObjects = (arrayOfVideoObjects, action) => {
  //input format
  // [{videoId: 23, views: 12324}, {videoId: 27, views: 34223} ]
  let validActions = ['create', 'delete', 'index', 'update'];
  if (validActions.indexOf(action) === -1 || !Array.isArray(arrayOfVideoObjects)) {
    return;
  }

  let exportable = [];
  arrayOfVideoObjects.forEach(item => {
    let action_and_meta_data = create_action_and_meta_data(item.videoId, action);
    exportable.push(action_and_meta_data);

    if (action !== 'delete') {
      let optional_source;
      if (action === 'update') {
        optional_source = {doc: item}; 
      } else if (action === 'create' || action === 'index') {
        optional_source = item;
      }

      exportable.push(optional_source); 
    } 
  });

  return exportable; 
};

module.exports.buildElasticUpdateObjects = buildElasticUpdateObjects;
