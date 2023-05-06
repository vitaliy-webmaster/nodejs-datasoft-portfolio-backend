import type { Request, Response } from 'express';
import PortfolioItem from '../models/PortfolioItem.js';

const getPortfolioItemHandler = async (
  req: Request<{ slug: string }>,
  res: Response,
) => {
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
};

export { getPortfolioItemHandler };
