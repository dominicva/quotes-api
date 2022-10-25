import { Router } from 'express';

const router = Router();

/**
 * Quote
 */

router.get('/quote', (req, res) => {
  res.status(200).json({ message: 'get all quotes' });
});

router.get('/quote/:id', (req, res) => {
  res.status(200).json({ message: `get quote with id: ${req.params.id}` });
});

const createQuote = (req, res) => {
  console.log('req.body:', req.body);
  // const { text, author } = req.body;
  res.status(200).json({ message: 'create quote' });
};

router.post('/quote', createQuote);

// (req, res) => {
//   res.status(200).json({ message: 'create quote' });
// }

router.put('/quote/:id', (req, res) => {
  res.status(200).json({ message: `update quote with id: ${req.params.id}` });
});

router.delete('/quote/:id', (req, res) => {
  res.status(200).json({ message: `delete quote with id: ${req.params.id}` });
});

export default router;
