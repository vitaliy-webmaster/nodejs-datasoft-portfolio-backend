import express from 'express';
import type { ErrorRequestHandler } from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import helmet from 'helmet';
import dotenv from 'dotenv';
import {
  messageRouter,
  portfolioItemRouter,
  portfolioItemsRouter,
} from './routes/index.js';

dotenv.config({ path: './.env.local', override: true });

const port = parseInt(process.env.PORT || '7000', 10);
const dev = process.env.NODE_ENV !== 'production';

const server = express();

try {
  await mongoose.connect(process.env.DB_URI as string);
  console.log('MongoDB connected successfully');
} catch (err) {
  console.log('MongoDB connection error. Check:', err);
}

if (!dev) {
  server.use(helmet());
  server.use(compression());
}

server.use(express.json());

server.use(portfolioItemsRouter);
server.use(portfolioItemRouter);
server.use(messageRouter);

server.use(((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    type: 'error',
    message: err.message,
  });
}) as ErrorRequestHandler);

server.listen(port, () => {
  console.log('Server is ready on port: ' + port);
});
