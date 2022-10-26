import { Router } from 'express';
import { body } from 'express-validator';
import {
  createQuote,
  deleteQuote,
  getAllQuotes,
  getOneQuote,
  updateQuote,
} from './handlers/quote';
import { handleInputErrors } from './modules/middleware';

const router = Router();

/**
 * Quote
 */
router.get('/quote', getAllQuotes);

router.get('/quote/:id', getOneQuote);

router.post(
  '/quote',
  body('text').exists(),
  body('author').exists(),
  handleInputErrors,
  createQuote
);

router.put(
  '/quote/:id',
  body('text').custom((value, { req }) => {
    return value || req.body.author;
  }),
  handleInputErrors,
  updateQuote
);

router.delete('/quote/:id', deleteQuote);

export default router;
