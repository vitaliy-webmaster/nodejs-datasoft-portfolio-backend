import express from 'express';
import {
  getPortfolioItemsHandler,
  postPortfolioItemsHandler,
} from '../controllers/index.js';

const router = express.Router();

router.get('/api/portfolio-items', getPortfolioItemsHandler);

router.post('/api/portfolio-items', postPortfolioItemsHandler);

export default router;
