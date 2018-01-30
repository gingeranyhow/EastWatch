
let create_action_and_meta_data = (video_id) => {
  return {update: {
    _index: 'bettersearch', 
    _type: 'video', 
    _id: video_id
  }};
};

let updateViews = (data) => {
  let exportable = [];

  JSON.parse(data).forEach(item => {
    let action_and_meta_data = create_action_and_meta_data(item.video_id);
    let optional_source = {doc: {views: item.views}};
    exportable.push(action_and_meta_data);
    exportable.push(optional_source);
  });

  return exportable; 
};


module.exports.updateViews = updateViews;