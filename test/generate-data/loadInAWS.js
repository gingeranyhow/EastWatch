var elasticsearch = require('elasticsearch');
const Promise = require('bluebird');
var readFilePromise = Promise.promisify(require('fs').readFile);

var client = new elasticsearch.Client({  
  host: 'https://search-east-watch-d5kj2ffyn2yiyofuhagkpot4ii.us-east-1.es.amazonaws.com',
  log: 'info',
  requestTimeout: 60000
});


// curl -H 'Content-Type: application/x-ndjson' -XPOST 'https://search-east-watch-d5kj2ffyn2yiyofuhagkpot4ii.us-east-1.es.amazonaws.com/bettersearch/doc/_bulk?pretty' --data-binary @yt-0.json

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


// let splitAndUpload = (filename) => {
//   let lines = require(filename);

//   // console.log(typeof(lines));
//   // var lines = data.split('\n'); 
//   let promiseArray = [];
//   let maxLine = 22250;
//   for (var i = 0; i < 3; i++) {
//     let start = i * maxLine;
//     let endpoint = (i + 1) * maxLine;
//     let chunk = lines.slice(start, endpoint);
//     //console.log(chunk);

//     setTimeout(uploadToAWS.bind(null, chunk), i * 3000);
    
//     // let mypromise = new Promise(uploadToAWS.bind(null, chunk));
//     // promiseArray.push(mypromise);
//   }

//   Promise.all(promiseArray)
//     .catch(err => console.error(err));
// };

let splitAndUpload = (filename) => {
  let lines = require(filename);

  // var lines = data.split('\n'); 
  let promiseArray = [];
  let maxLine = 22250;
  for (var i = 0; i < 9; i++) {
    let start = i * maxLine;
    let endpoint = (i + 1) * maxLine;
    let chunk = lines.slice(start, endpoint);
    //console.log(chunk);
    // let mypromise = new Promise(uploadToAWS.bind(null, chunk));
    promiseArray.push(uploadToAWS.bind(null, chunk));
  }

  // console.log(promiseArray[0]);

  promiseArray[0]()
    .then(promiseArray[1]())
    .then(promiseArray[2]())
    .then(promiseArray[3]())
    .then(promiseArray[4]())
    .then(promiseArray[5]())
    .then(promiseArray[6]())
    .then(promiseArray[7]())
    .then(promiseArray[8]())
    .catch(err => console.error(err));  
};

splitAndUpload(`${fileBase}/fake-99.json`);

// let uploadInLoop = (myLoop, endLoop) => {  
//   console.time(`upload ${myLoop}`);
  
//   let fileName = `${fileBase}/fake-${myLoop}.json`;

//   splitAndUpload(fileName, uploadData)
//     .then(() => {
//       if (myLoop < endLoop) { // call again until max
//         uploadInLoop(myLoop + 1, endLoop);
//       } else {
//         console.timeEnd(`upload ${myLoop}`);
//       }
//     })
//     .catch(err => {
//       console.error(err);
//     });
// };

// let start = 99;
// let end = 99;
// //uploadInLoop(70, 74);
// uploadInLoop(start, end);



// -------------

// readFilePromise("myfile.js", "utf8").then(function(contents) {
//   return eval(contents);
// }).then(function(result) {
//     console.log("The result of evaluating myfile.js", result);
// }).catch(SyntaxError, function(e) {
//     console.log("File had syntax error", e);
// //Catch any other error
// }).catch(function(e) {
//     console.log("Error reading file", e);
// });
