var elasticsearch = require('elasticsearch');
// const Promise = require('bluebird');
// var readFilePromise = Promise.promisify(require('fs').readFile);

var client = new elasticsearch.Client({  
  host: 'https://search-east-watch-d5kj2ffyn2yiyofuhagkpot4ii.us-east-1.es.amazonaws.com',
  log: 'info',
  requestTimeout: 600000
});

let fileBase = '/Users/christiginger/code/hackreactor/EastWatch/test/generate-data/files/all';


let uploadToAWS = (data) => {
  return client.bulk({
    body: data
  })
    .then(res => {
      console.log('took:', res.took, '| errors:', res.errors, '| items:', res.items && res.items.length);
    })
    .catch(err => console.error(err));  
};

let splitAndUpload = (filename) => {
  let lines = require(filename);

  // var lines = data.split('\n'); 
  let promiseArray = [];
  let maxLine = 22250;
  for (var i = 0; i < 9; i++) {
    let start = i * maxLine;
    let endpoint = (i + 1) * maxLine;
    let chunk = lines.slice(start, endpoint);
    promiseArray.push(uploadToAWS.bind(null, chunk));
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

// splitAndUpload(`${fileBase}/fake-99.json`);

let uploadInLoop = (myLoop, endLoop) => {  
  console.time(`upload ${myLoop}`);
  
  let fileName = `${fileBase}/fake-${myLoop}.json`;

  splitAndUpload(fileName)
    .then(() => {
      console.timeEnd(`upload ${myLoop}`);
      if (myLoop < endLoop) { // call again until max
        uploadInLoop(myLoop + 1, endLoop);
      }
    })
    .catch(err => {
      console.error(err);
    });
};

// let uploadInLoop = (myLoop, endLoop) => {  
//   let queue = [];
//   for (var i = myLoop; i <= endLoop; i++) {
//     let fileName = `${fileBase}/fake-${myLoop}.json`;
//     queue.push(fileName);
//   }
//   console.time(`upload ${myLoop}`);
//   console.log(queue);
  
//   while (queue.length > 0) {
//     console.log('process', queue.length);
//     console.time(`upload ${myLoop}`);
//     splitAndUpload(queue[queue.length - 1])
//       .then(() => {
//         queue.pop();
//         console.timeEnd(`upload ${myLoop}`);
//       })
//       .catch(err => {
//         console.error(err);
//       });
//   }
// };



let start = 18;
let end = 28;
//let end = 89;
uploadInLoop(start, end);

