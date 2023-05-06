import type { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';

const postMessageHandler = async (req: Request, res: Response) => {
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
};

export { postMessageHandler };
