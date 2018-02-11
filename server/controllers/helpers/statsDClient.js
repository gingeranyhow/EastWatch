require('dotenv').config();
const statsD = require('node-statsd');


let statsDClient = () => {
  // var statsDClient = new statsD({
  //   host: 'statsd.hostedgraphite.com',
  //   port: 8125,
  //   prefix: process.env.HOSTEDGRAPHITE_APIKEY
  // });

  var statsDClient = new statsD({
    host: 'statsd.hostedgraphite.com',
    port: 8125,
    prefix: process.env.HOSTEDGRAPHITE_APIKEY
  });

  statsDClient.socket.on('error', function(error) {
    return console.error("Error in socket: ", error);
  });

  return statsDClient;
};


module.exports = statsDClient;