import express from 'express';
import sitesRouter from './siteController/index.js';

const router = express.Router();

router.use('/sites', sitesRouter);

export default router;