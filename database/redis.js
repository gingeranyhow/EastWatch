require('dotenv').config();
var Redis = require('ioredis');
let redisUrl = process.env.ENVIR === 'prod' && process.env.REDIS_URL
  ? process.env.REDIS_URL
  : '127.0.0.1';

// var redis = new Redis();
var redis = new Redis(6379, redisUrl);

let updateRedis = (key, value) => {
  redis.set(key, value, 'EX', 300);
}

module.exports.update = updateRedis;

let getRedis = (key) => {
  return redis.get(key);
}

module.exports.get = getRedis;

