import express from 'express';
import { postMessageHandler } from '../controllers/index.js';

const router = express.Router();

router.post('/api/message', postMessageHandler);

export default router;
