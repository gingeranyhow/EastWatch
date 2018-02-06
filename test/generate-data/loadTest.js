var elasticsearch = require('elasticsearch');

let fileBase = '/Users/christiginger/code/hackreactor/EastWatch/test/generate-data/files/archive';
let fileName = `${fileBase}/test.json`;
let data = require(fileName);

var client = new elasticsearch.Client({  
  host: 'https://search-east-watch-d5kj2ffyn2yiyofuhagkpot4ii.us-east-1.es.amazonaws.com',
  log: 'info'
});

let uploadToAWS = (data) => {
  return client.bulk({
    body: data
  })
    .then(res => {
      console.log('took:', res.took, '| errors:', res.errors, '| items:', res.items && res.items.length);
    });  
};

let promisey = new Promise(uploadToAWS.bind(null, data));

Promise.all([promisey])
  .catch(err => console.error(err));
