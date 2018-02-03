var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({  
  host: 'localhost:9200',
  log: 'info'
});


let fileBase = '/Users/christiginger/code/hackreactor/EastWatch/data_generation/files/all';
let fileName = `${fileBase}/fake-4.json`;

// let uploadToElastic = (fileName) => {
//   let data = require(fileName);
//   client.bulk({
//     body: data
//   })
//     .then(res => {
//       console.log('took:', res.errors, '| errors:', res.errors, '| items:', res.items && res.items.length);
//     })
//     .catch(err => {
//       console.error(err);
//     }); 
// };

let uploadInLoop = (myLoop, endLoop) => {  
  let fileName = `${fileBase}/fake-${myLoop}.json`;
  let data = require(fileName);
  console.log('~~~~ starting ~~~~~', myLoop);
  client.bulk({
    body: data
  })
    .then(res => {
      console.log('took:', res.took, '| errors:', res.errors, '| items:', res.items && res.items.length);
      if (myLoop < endLoop) { // call again until max
        uploadInLoop(myLoop + 1, endLoop);
      } else {
        console.timeEnd('upload-mil');
      }
    })
    .catch(err => {
      console.error(err);
    });
};
console.time('upload-mil');
let start = 5;
//uploadInLoop(70, 74);
uploadInLoop(start, start);

