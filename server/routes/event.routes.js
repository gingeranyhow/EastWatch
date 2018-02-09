const Router = require('koa-router');
const router = new Router();
const eventController = require('../controllers/eventController');
const BASE_URL = '/api/actions';
const bodyParser = require('koa-bodyparser');

router.post(`${BASE_URL}`, bodyParser(), eventController.index);

module.exports = router;
