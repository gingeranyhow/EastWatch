
/* 
This file creates a simple /trending route
for testing purposes. Once the trend services is working
this file can be retired
*/ 

const Router = require('koa-router');
const router = new Router();
const trendController = require('../controllers/trendingFakeController');
const BASE_URL = '/service/trending';

router.get(`${BASE_URL}`, trendController.index);

module.exports = router;