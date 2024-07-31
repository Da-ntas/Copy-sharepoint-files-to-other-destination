import express from 'express';
import sitesRouter from './siteController/index.js';
import filesRouter from './fileController/index.js';
import moveRouter from './moveController/index.js';
import logs_router from './logs/index.js';

const router = express.Router();

router.use('/sites', sitesRouter);

router.use('/file', filesRouter);

router.use('/move', moveRouter);

router.use('/logs', logs_router);

export default router;