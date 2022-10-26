import { Router } from 'express';
import { body } from 'express-validator';
import {
  createQuote,
  deleteQuote,
  getAllQuotes,
  getOneQuote,
  searchQuotes,
  updateQuote,
} from './handlers/quote';
import { handleInputErrors } from './modules/middleware';

const router = Router();

/**
 * Quote
 */
router.get('/quote', getAllQuotes);

router.get('/quote/:id', getOneQuote);

router.get('/quote/:query', searchQuotes);

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
    // workaround to ensure at least one of text or author fields included
    return value || req.body.author;
  }),
  handleInputErrors,
  updateQuote
);

router.delete('/quote/:id', deleteQuote);

export default router;
