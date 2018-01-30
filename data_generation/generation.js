require('dotenv').config();
const axios = require('axios');
var faker = require('faker');
let key = process.env.YOUTUBE_API_KEY;
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));


/* FUNCTIONS */

let formatAndWriteVideos = (videoArray, nextId) => {
  var stream = fs.createWriteStream('data_generation/files/v2.json', {flags: 'a'});

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

  return axios.get('https://www.googleapis.com/youtube/v3/search', {params: options});
};

// My actual work
let nextId = 240799;
let rounds = 10000;

runSearch = () => {
  let fakeWord = faker.random.words();
  searchYouTube({query: fakeWord, max: 50})
    .then(results => {
      return formatAndWriteVideos(results.data.items, nextId);
    })
    .then(updatedId => {
      nextId = updatedId;
    })
    .then(() => {
      return fs.appendFileAsync('data_generation/files/search-terms.txt', fakeWord + '\n');
    })
    .catch(err => {
      console.error(err);
      breakLoop = true;
    });
};

(function myLoop(loops) {          
  setTimeout(function () {   
    runSearch();               
    if (--loops) { // decrement i and call myLoop again if i > 0
      myLoop(loops);
    } else {
      console.log(nextId);
    }
  }, 800);
})(rounds); 

// for (var i = 0; i < rounds; i++) {
//   let breakLoop;
//   let fakeWord = faker.random.words();
//   // let fakeWord = 'corgis'
//   searchYouTube({query: fakeWord, max: 50})
//     .then(results => {
//       return formatAndWriteVideos(results.data.items, nextId);
//     })
//     .then(updatedId => {
//       nextId = updatedId;
//     })
//     .then(() => {
//       return fs.appendFileAsync('data_generation/search-terms.txt', fakeWord + '\n');
//     })
//     .catch(err => {
//       console.error(err);
//       breakLoop = true;
//     });

//   if (breakLoop) {
//     break;
//   }

//   if (i === rounds - 1) {
//     console.log(nextId);  
//   }
// }

// order=date&type=video&key={YOUR_API_KEY}
// other ways to order
// https://developers.google.com/youtube/v3/docs/search/list

// let test = [ { kind: 'youtube#searchResult',
//     etag: '"Wu2llbfqCdxIVjGbVPm2DslKPCA/lb0X_i--QMBe_raq1JGJm0zIkWo"',
//     id: { kind: 'youtube#video', videoId: 'odGzAQ5pGgE' },
//     snippet: 
//      { publishedAt: '2017-01-19T09:50:14.000Z',
//        channelId: 'UCZjvj5MN3BMxPFfdEKIrvxQ',
//        title: 'The Maxpedition AGR Line Expands! SHOT Show 2017',
//        description: 'For Patches, Shirts and more: http://thelateboyscout.com Blade HQ: http://shrsl.com/?~d6hk Use code "TLBS" for 5% off your entire OpticsPlanet.com order Optics Planet: http://bit.ly/1T8eUB6...',
//        thumbnails: [Object],
//        channelTitle: 'The Late Boy Scout',
//        liveBroadcastContent: 'none' } },
//   { kind: 'youtube#searchResult',
//     etag: '"Wu2llbfqCdxIVjGbVPm2DslKPCA/m0T0MoG1JYusSMPChctbgfo0Jio"',
//     id: { kind: 'youtube#video', videoId: 'JO1I86-MoJ4' },
//     snippet: 
//      { publishedAt: '2017-06-05T21:51:00.000Z',
//        channelId: 'UCokbcF52AEExNQ30h7vi6yQ',
//        title: 'ALL My Gear - Weekend of Rifle Training - Sage Dynamics and Friends',
//        description: 'Just some clips tossed together from some rifle training I did down in Colorado Springs with Sage Dynamics over the weekend. Good time with good people. http://www.sagedynamics.org/ https://www.ma...',
//        thumbnails: [Object],
//        channelTitle: 'Last Line Of Defense',
//        liveBroadcastContent: 'none' } },
//   { kind: 'youtube#searchResult',
//     etag: '"Wu2llbfqCdxIVjGbVPm2DslKPCA/ZC3bZ3JVgzGEJ08vHCrwWLFJxSs"',
//     id: { kind: 'youtube#video', videoId: 'YXAl-rMmxZQ' },
//     snippet: 
//      { publishedAt: '2016-05-17T15:02:20.000Z',
//        channelId: 'UC7-hR5EfgpM6oHfiGDkxfMA',
//        title: 'MTG - Deck Boxes 18 - Compare and Contrast the Best Boxes for Magic: The Gathering, Pokemon!',
//        description: 'Buy the R.E.P. Steel Deck Box here: http://www.repgamingproducts.com/ Buy the Spinning Top Deck Box here: http://www.leifkicker.com/ Time Walker Deck Boxes can be purchased at: www.morningstar-h...',
//        thumbnails: [Object],
//        channelTitle: 'Tolarian Community College',
//        liveBroadcastContent: 'none' } },
//   { kind: 'youtube#searchResult',
//     etag: '"Wu2llbfqCdxIVjGbVPm2DslKPCA/3o7pW_0K8Njoyiq6gImUv2IR9P8"',
//     id: { kind: 'youtube#video', videoId: 'jDCCAflsVi8' },
//     snippet: 
//      { publishedAt: '2012-01-27T16:44:44.000Z',
//        channelId: 'UCb0xfM3HGOsqPYNAocXXNAQ',
//        title: 'Impractical Jokers - Guys Steal Food Off People\'s Plates at Buffet',
//        description: 'Starving Impractical Jokers, no plate is safe! New episodes premiere Thursday, July 16 at 10/9c on truTV New episodes Thursdays at 10/9c on truTV Subscribe to truTV on YouTube: http://full.sc/1s9...',
//        thumbnails: [Object],
//        channelTitle: 'truTV',
//        liveBroadcastContent: 'none' } },
//   { kind: 'youtube#searchResult',
//     etag: '"Wu2llbfqCdxIVjGbVPm2DslKPCA/k-07DJR0qWOSySGZLqSuH9BEOBo"',
//     id: { kind: 'youtube#video', videoId: 'giRvJkq420I' },
//     snippet: 
//      { publishedAt: '2017-01-20T16:34:37.000Z',
//        channelId: 'UCZjvj5MN3BMxPFfdEKIrvxQ',
//        title: 'UTG Rails with BLING!!! SHOT Show 2017',
//        description: 'Leapers UTG Products here: http://amzn.to/2iX8xB7 For Patches, Shirts and more: http://thelateboyscout.com Blade HQ: http://shrsl.com/?~d6hk Use code "TLBS" for 5% off your entire OpticsPlanet.com...',
//        thumbnails: [Object],
//        channelTitle: 'The Late Boy Scout',
//        liveBroadcastContent: 'none' } },
//   { kind: 'youtube#searchResult',
//     etag: '"Wu2llbfqCdxIVjGbVPm2DslKPCA/da8w4Wtlal_7dtjlwLvq_iT-UfE"',
//     id: { kind: 'youtube#video', videoId: 'wJNnuHEC4f4' },
//     snippet: 
//      { publishedAt: '2017-10-13T15:00:06.000Z',
//        channelId: 'UCGd3WlRm5s_NVLIqCefLMpA',
//        title: 'France 1940 - Review d\'uniforme',
//        description: 'Découvrez l\'uniforme porté par l\'Armée française pendant la campagne de 1940 Merci à Baptiste, Sonia, Adrien et Yves pour leur aide ! Un IMMENSE merci à Ugo Bimar pour sa participation,...',
//        thumbnails: [Object],
//        channelTitle: 'Neo035',
//        liveBroadcastContent: 'none' } },
//   { kind: 'youtube#searchResult',
//     etag: '"Wu2llbfqCdxIVjGbVPm2DslKPCA/buyDZVqOP7PfxuMILC5x4NRhPgE"',
//     id: { kind: 'youtube#video', videoId: 'IRVdiHu1VCc' },
//     snippet: 
//      { publishedAt: '2009-03-05T20:12:47.000Z',
//        channelId: 'UCAuUUnT6oDeKwE6v1NGQxug',
//        title: 'Learning from dirty jobs | Mike Rowe',
//        description: 'http://www.ted.com Mike Rowe the host of "Dirty Jobs," tells some compelling (and horrifying) real-life job stories. Listen for his insights and observations about the nature of hard work,...',
//        thumbnails: [Object],
//        channelTitle: 'TED',
//        liveBroadcastContent: 'none' } },
//   { kind: 'youtube#searchResult',
//     etag: '"Wu2llbfqCdxIVjGbVPm2DslKPCA/mgvEZdwvx193WDl5sAgvcUGbk3o"',
//     id: { kind: 'youtube#video', videoId: 'WzHG-ibZaKM' },
//     snippet: 
//      { publishedAt: '2013-09-15T15:03:04.000Z',
//        channelId: 'UChk5eyAGuO3J4rV-CiMNkNQ',
//        title: 'Fastest shooter EVER, Jerry Miculek- World record 8 shots in 1 second & 12 shot reload! HD',
//        description: '1999 World Record revolver drills accomplished by Jerry Miculek! SHARE ON FACEBOOK!: http://on.fb.me/16CBP1m www.Miculek.com LIKE JERRY ON FACEBOOK!: http://www.facebook.com/pages/Jerry-Miculek...',
//        thumbnails: [Object],
//        channelTitle: 'Miculek.com- The Leaders in Gun Control!',
//        liveBroadcastContent: 'none' } },
//   { kind: 'youtube#searchResult',
//     etag: '"Wu2llbfqCdxIVjGbVPm2DslKPCA/mP1-MC7-gZezOu614unhZMUn1tY"',
//     id: { kind: 'youtube#video', videoId: 's7uScWHcTzk' },
//     snippet: 
//      { publishedAt: '2016-09-28T01:00:18.000Z',
//        channelId: 'UC3ScyryU9Oy9Wse3a8OAmYQ',
//        title: 'The Choice 2016 (full film) | FRONTLINE',
//        description: 'The dueling stories of Hillary Clinton and Donald Trump as they battle for the presidency. Subscribe on YouTube: http://bit.ly/1BycsJW Hillary Clinton and Donald Trump are two of the most...',
//        thumbnails: [Object],
//        channelTitle: 'FRONTLINE PBS | Official',
//        liveBroadcastContent: 'none' } },
//   { kind: 'youtube#searchResult',
//     etag: '"Wu2llbfqCdxIVjGbVPm2DslKPCA/Tu6kd3_ovQ5pbhVfh7N5JvF_8Lg"',
//     id: { kind: 'youtube#video', videoId: 'Mx8JkGHaGUI' },
//     snippet: 
//      { publishedAt: '2016-10-27T00:00:30.000Z',
//        channelId: 'UCBUVGPsJzc1U8SECMgBaMFw',
//        title: '3 Horrifying Cases Of Ghosts And Demons',
//        description: 'Can ghosts and demons harm the living? Check out more awesome BuzzFeedBlue videos! http://bit.ly/YTbuzzfeedblue1 GET MORE BUZZFEED www.buzzfeed.com/videoteam www.facebook.com/buzzfeedvideo...',
//        thumbnails: [Object],
//        channelTitle: 'BuzzFeedBlue',
//        liveBroadcastContent: 'none' } } ]


//        formatVideos(test);
