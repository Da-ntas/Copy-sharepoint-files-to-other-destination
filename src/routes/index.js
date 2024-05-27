import express from 'express';
import sitesRouter from './siteController/index.js';
import filesRouter from './fileController/index.js';

const router = express.Router();

router.use('/sites', sitesRouter);
router.use('/files', filesRouter);

export default router;