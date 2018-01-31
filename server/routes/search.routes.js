const Router = require('koa-router');
const router = new Router();
const searchController = require('../controllers/searchController');
const BASE_URL = '/api/search';

router.get(`${BASE_URL}`, searchController.index);


// Temporary Route to validate db connection
router.get(`${BASE_URL}/status`, searchController.check);

module.exports = router;
