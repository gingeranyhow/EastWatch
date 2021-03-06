const Router = require('koa-router');
const router = new Router();
const videoController = require('../controllers/videoController');
const BASE_URL = '/api/video';

router.get(`${BASE_URL}`, videoController.getVideo);
router.get(`${BASE_URL}/:videoId`, videoController.getVideo);

module.exports = router;
