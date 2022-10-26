import path from 'path';
import express from 'express';
import morgan from 'morgan';
import { createNewUser, signin } from './handlers/user';
import { protect } from './modules/auth';
import router from './router';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/api', protect, router);

app.post('/user', createNewUser);
app.post('/signin', signin);

app.use((err, _req, res, _next) => {
  console.error('Error message:', err.message);

  if (err.meta) {
    console.error('Cause:', err.meta.cause);
  }

  if (err.type === 'auth') {
    res.status(401).json({ message: 'unauthorized' });
  } else if (err.type === 'username taken') {
    res.status(400).json({ message: 'username already taken' });
  } else if (err.type === 'input') {
    res.status(400).json({ message: 'invalid input' });
  } else {
    res.status(500).json({ message: "oops, that's on us" });
  }
});

export default app;
