require('dotenv').config();

// const statsd = require('node-statsd');
// var appstatsd = require('appmetrics-statsd').StatsD(
//   host: 'statsd.hostedgraphite.com',
//   port: 8125,
//   prefix: process.env.HOSTEDGRAPHITE_APIKEY
// );

const statsD = require('node-statsd');
var statsDClient = new statsD({
  host: 'statsd.hostedgraphite.com',
  port: 8125,
  prefix: process.env.HOSTEDGRAPHITE_APIKEY
});

module.exports = statsDClient;