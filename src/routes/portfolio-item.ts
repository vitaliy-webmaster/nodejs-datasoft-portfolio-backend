import express from 'express';
import { getPortfolioItemHandler } from '../controllers/index.js';

const router = express.Router();

router.get('/api/portfolio-item/:slug', getPortfolioItemHandler);

export default router;
