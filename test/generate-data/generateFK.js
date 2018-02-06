var faker = require('faker');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
const path = require('path');

/* FUNCTIONS */

let formatAndWriteVideos = (startId, endId) => {
  var stream = fs.createWriteStream(path.join(__dirname, `files/all/fake-${startId / 100000}.json`));
  stream.write('[');
  let separator = '';

  for (var i = startId; i <= endId; i++) {
    let bias = Math.random();
    let randomViews = bias > .85 
      ? Math.floor(Math.random() * 50000000)
      : Math.floor(Math.random() * 100000);

    let duration = .05 < bias < .95
      ? Math.floor(Math.random() * 30000000)
      : Math.floor(Math.random() * 980000);

    let thumbnails = {"default":{"url":"https://i.ytimg.com/vi/S2H3bF2UvkA/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/S2H3bF2UvkA/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/S2H3bF2UvkA/hqdefault.jpg","width":480,"height":360}};

    let JSON_elastic = {index: {_index: 'bettersearch', _type: 'video', _id: i}};

    let JSON_output = {
      type: 'video',
      videoId: i,
      views: randomViews,
      title: faker.random.words(8),
      description: faker.random.words(30),
      publishedAt: faker.date.past(),
      channelTitle: faker.random.words(2),
      duration: duration,
      thumbnails: thumbnails
    };

    stream.write(separator + JSON.stringify(JSON_elastic) + ',\n' + JSON.stringify(JSON_output));

    if (!separator) {
      separator = ',\n';
    }
  }
  stream.write(']\n');
  stream.end(); 
  console.log('closed ----');
};


/* RUN TWO ROUNDS */

let start = 80;
let end = 80;
console.time('one-mill');

(function myLoop(max, current) {
  let sizeToWrite = 100000;
  let starterId = current * 100000;
  console.log('starting ~~~~ ', current);
  formatAndWriteVideos(starterId, starterId + sizeToWrite - 1);               
  if (current < max) { // decrement i and call myLoop again if i > 0
    myLoop(max, current + 1);
  } 
})(end, start); // inclusive of files
console.timeEnd('one-mill');

