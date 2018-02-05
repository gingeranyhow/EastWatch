var elasticsearch = require('elasticsearch');
var Promise = require('bluebird');
var fs = require('fs');

var client = new elasticsearch.Client({  
  host: 'localhost:9200/bettersearch/video',
  log: 'info'
});

let fileBase = '/Users/christiginger/code/hackreactor/EastWatch/test/generate-data/files/all';

let nonLeakyUpload = (data) => {
  return new Promise(function (resolve) {
    client.bulk({
      body: data
    })
      .then((res) => { 
        console.log('took:', res.took, '| errors:', res.errors, '| items:', res.items && res.items.length);
        resolve(); 
      })
      .catch(err => console.error(err));
  });
};

let uploadInLoop = (myLoop, endLoop, type = 'fake') => {  
  if (myLoop > endLoop) {
    return;
  }

  let data;
  if (type === 'yt') {
    let file = fs.readFileSync(`${fileBase}/yt-${myLoop}.json`, 'utf8');
    data = file.split('\n');  
  } else {
    data = require(`${fileBase}/fake-${myLoop}.json`);
  }

  console.log('~~~~ starting: ', myLoop); 

  return nonLeakyUpload(data)
    .then(() => {
      return uploadInLoop(myLoop + 1, endLoop);
    })
    .catch((err) => console.error(err));
};

let start = 99;
let end = 99;
uploadInLoop(start, end, 'fake')
  .then(() => console.log('done'));

