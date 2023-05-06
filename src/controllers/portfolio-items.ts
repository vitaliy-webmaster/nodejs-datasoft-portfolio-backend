import { Request, Response } from 'express';
import PortfolioItem from '../models/PortfolioItem.js';

const getPortfolioItemsHandler = async (req: Request, res: Response) => {
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
};

const postPortfolioItemsHandler = async (req: Request, res: Response) => {
  const {
    pass,
    category,
    priority,
    title,
    portfolioUrl,
    websiteUrl,
    previewImg,
    fullscreenImgs,
    description,
    endDate,
  } = req.body;

  const item = new PortfolioItem({
    pass,
    category,
    priority,
    title,
    portfolioUrl,
    websiteUrl,
    previewImg,
    fullscreenImgs,
    description,
    endDate,
  });

  try {
    await item.save();
    return res.json({
      type: 'add-portfolio-item',
      status: 'success',
      payload: '',
    });
  } catch (err) {
    return res.status(400).json({
      type: 'add-portfolio-item',
      status: 'error',
      payload: err,
    });
  }
};

export { getPortfolioItemsHandler, postPortfolioItemsHandler };
