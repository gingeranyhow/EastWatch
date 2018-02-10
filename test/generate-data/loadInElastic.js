var elasticsearch = require('elasticsearch');
var Promise = require('bluebird');
var fs = require('fs');

let fileBase = '/Users/christiginger/code/hackreactor/EastWatch/test/generate-data/files/all';
// LOCAL ONLY
var localClient = new elasticsearch.Client({  
  host: 'localhost:9200/bettersearch/video',
  log: 'info'
});

// AWS ONLY
var awsClient = new elasticsearch.Client({  
  //host: 'https://search-east-watch-qwgjpr7wgcepxn5pqbqfjirkn4.us-west-1.es.amazonaws.com/bettersearch/video',
  host: 'https://search-eastwatch-2-phxnqe6eimpxlwtbgpgikpp2tm.us-west-1.es.amazonaws.com/bettersearch/video',
  log: 'info',
  requestTimeout: 600000
});

let nonLeakyUpload = (data) => {
  return new Promise(function (resolve) {
    localClient.bulk({
      body: data
    })
      .then((res) => { 
        console.log('took:', res.took, '| errors:', res.errors, '| items:', res.items && res.items.length);
        resolve(); 
      })
      .catch(err => console.error(err));
  });
};

// AWS ----> 
let nonLeakyAWSUpload = (data) => {
  return new Promise(function (resolve) {
    awsClient.bulk({
      body: data
    })
      .then((res) => { 
        console.log('took:', res.took, '| errors:', res.errors, '| items:', res.items && res.items.length);
        resolve(); 
      })
      .catch(err => console.error(err));
  });
};


let splitAndUploadToAWS = (lines) => { 
  let promiseArray = [];
  let maxLine = 22250;
  for (var i = 0; i < 9; i++) {
    let start = i * maxLine;
    let endpoint = (i + 1) * maxLine;
    let chunk = lines.slice(start, endpoint);
    promiseArray.push(nonLeakyAWSUpload.bind(null, chunk, 'aws'));
  }

  return promiseArray[0]()
    .then(() => promiseArray[1] && promiseArray[1]())
    .then(() => promiseArray[2] && promiseArray[2]())
    .then(() => promiseArray[3] && promiseArray[3]())
    .then(() => promiseArray[4] && promiseArray[4]())
    .then(() => promiseArray[5] && promiseArray[5]())
    .then(() => promiseArray[6] && promiseArray[6]())
    .then(() => promiseArray[7] && promiseArray[7]())
    .then(() => promiseArray[8] && promiseArray[8]())
    .catch(err => console.error(err));  
};

// SHARED 

let uploadInLoop = (myLoop, endLoop, type = 'fake', destination = 'local') => {  
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
  let uploadFunction = (destination === 'local')
    ? nonLeakyUpload
    : splitAndUploadToAWS;

  return uploadFunction(data)
    .then(() => {
      return uploadInLoop(myLoop + 1, endLoop, type, destination);
    })
    .catch((err) => console.error(err));
};

let start = 71;
let end = 99;
uploadInLoop(start, end, 'fake', 'aws')
  .then(() => console.log('done'));

