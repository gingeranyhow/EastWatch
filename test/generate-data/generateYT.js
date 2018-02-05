require('dotenv').config();

const axios = require('axios');
var faker = require('faker');
const key = process.env.YOUTUBE_API_KEY;
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
const path = require('path');
var randomWords = require('random-words');

/* FUNCTIONS */

let formatAndWriteVideos = (videoArray, nextId, fileId) => {
  
  var stream = fs.createWriteStream(path.join(__dirname, `files/all/yt-${fileId}.json`), {flags: 'a'});

  videoArray.forEach((video) => {
    let bias = Math.random();
    let randomViews = bias > .85 
      ? Math.floor(Math.random() * 50000000)
      : Math.floor(Math.random() * 100000);

    let duration = .05 < bias < .95
      ? Math.floor(Math.random() * 30000000)
      : Math.floor(Math.random() * 980000);

    let JSON_elastic = {'index': {'_index': 'bettersearch', '_id': nextId}};

    let JSON_output = {
      type: 'video',
      videoId: nextId,
      views: randomViews,
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      channelTitle: video.snippet.channelTitle,
      duration: duration,
      thumbnails: video.snippet.thumbnails
    };
    stream.write(JSON.stringify(JSON_elastic) + '\n' + JSON.stringify(JSON_output) + '\n');
    nextId++;
  });
  stream.end();
  return nextId;  
};

var searchYouTube = ({query, max}) => {
  var options = {
    q: query,
    part: 'snippet',
    videoEmbeddable: true,
    maxResults: max,
    key: key,
    type: 'video'
  };

  return axios.get('https://www.googleapis.com/youtube/v3/search', {params: options})
    .catch(err => { 
      console.error(err.response);
    });
};

// My actual work

let nextId = 499798;
let rounds = Math.ceil((Math.ceil(nextId / 100000) * 100000 - nextId) / 50);
let file = (Math.floor(nextId / 100000));

runSearch = (loops) => {
  let fakeWord = randomWords({min: 1, max: 5, join: ' '});
  // let fakeWord = 'corgi';
  console.log('~~~~~Searching ', loops, ':', fakeWord);
  searchYouTube({query: fakeWord, max: 50})
    .then(results => {
      return formatAndWriteVideos(results.data.items, nextId, file);
    })
    .then(updatedId => {
      nextId = updatedId;
    })
    .then(() => {
      return fs.appendFileAsync(path.join(__dirname, 'files/search-terms.txt'), fakeWord + '\n');
    })
    .catch(err => {
      console.error(err);
      breakLoop = true;
    });
};


(function myLoop(loops) {          
  setTimeout(function () {   
    runSearch(loops);               
    if (--loops) { // decrement i and call myLoop again if i > 0
      myLoop(loops);
    } else {
      console.log('~~~~~Completed~~~~~~');
    }
  }, 800);
})(rounds); 


// order=date&type=video&key={YOUR_API_KEY}
// other ways to order
// https://developers.google.com/youtube/v3/docs/search/list

