import dotenv from 'dotenv';
import express from 'express';
import type { Request, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import { check, validationResult } from 'express-validator';

import PortfolioItem from './models/PortfolioItem.js';

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

server.post('/api/message', async (req, res) => {
  await check('name')
    .notEmpty()
    .withMessage('Please, enter your name.')
    .isLength({ min: 2 })
    .withMessage('Name should be at least 2 chars long.')
    .trim()
    .escape()
    .run(req);

  await check('email')
    .notEmpty()
    .withMessage('Please, enter your email.')
    .trim()
    .escape()
    .isEmail()
    .withMessage('Your email is not correct.')
    .normalizeEmail()
    .run(req);

  await check('message')
    .notEmpty()
    .withMessage('Please, enter your message.')
    .isLength({ min: 10 })
    .withMessage('Message should be at least 10 chars long.')
    .trim()
    .escape()
    .run(req);

  const validationResults = validationResult(req);

  if (!validationResults.isEmpty()) {
    return res.status(400).json({
      type: 'message',
      status: 'error',
      payload: validationResults.array(),
    });
  }

  const { name, email, message } = req.body;

  return console.log(name, email, message);

  // sendMailFromServer(name, email, message)
  //     .then(() => {
  //         return res.json({ type: "message", status: "success" });
  //     })
  //     .catch(() => {
  //         return res.status(400).json({
  //             type: "message",
  //             status: "error",
  //             payload: [{msg : "Ошибка сервера. Email не отправлен."}]
  //         });
  //     });
});

// server.post("/api/portfolio-items", (req, res) => {
//     const { pass, category, priority, title, portfolioUrl, websiteUrl, previewImg, fullscreenImgs, description, endDate } = req.body;
//
//     const item = new PortfolioItem({
//         pass,
//         category,
//         priority,
//         title,
//         portfolioUrl,
//         websiteUrl,
//         previewImg,
//         fullscreenImgs,
//         description,
//         endDate
//     });
//
//     item.save((err, result) => {
//         if (err) return res.status(400).json({
//             type: "add-portfolio-item",
//             status: "error",
//             payload: err
//         });
//
//         return res.json({ type: "add-portfolio-item", status: "success", payload: "" });
//     });
// });

server.get('/api/portfolio-items', async (req, res) => {
  try {
    const result = await PortfolioItem.find({}).sort('-priority').exec();
    return res.status(200).json(result || []);
  } catch (err) {
    return res.status(400).json({
      type: 'get-portfolio-items',
      status: 'error',
      payload: 'internal server error',
    });
  }
});

server.get(
  '/api/portfolio-item/:slug',
  async (req: Request<{ slug: string }>, res) => {
    try {
      const result = await PortfolioItem.find({
        portfolioUrl: req.params.slug,
      });

      if (!result) {
        return res.json({
          type: 'get-portfolio-item',
          status: 'success',
          payload: {},
        });
      }

      return res.json({
        type: 'get-portfolio-item',
        status: 'success',
        payload: result,
      });
    } catch (err) {
      return res.status(400).json({
        type: 'get-portfolio-item',
        status: 'error',
        payload: 'internal server error',
      });
    }
  },
);

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
