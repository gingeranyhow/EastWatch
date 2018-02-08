
/* 
This file creates a simple endpoints
for testing purposes. Once the trend and video services are connected working
this file can be retired
*/ 
const Router = require('koa-router');
const router = new Router();
const serviceController = require('../controllers/tempServiceController');

router.get('/service/trending', serviceController.trend);
router.get('/service/video', serviceController.video);
router.get('/service/hello', serviceController.hello);

module.exports = router;