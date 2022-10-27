import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { createNewUser, signin } from './handlers/user';
import { protect } from './modules/auth';
import router from './router';
import { validateUsernameAndPassword } from './modules/middleware';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({ message: 'welcome!' });
});

app.use('/api', protect, router);

app.post('/user', validateUsernameAndPassword, createNewUser);
app.post('/signin', signin);

app.use((err, _req, res, _next) => {
  console.error('Error message:', err.message);

  let msg;

  if (Array.isArray(err.meta)) {
    msg = err.meta
      .filter(
        ({ msg }) => msg.startsWith('username') || msg.startsWith('password')
      )
      .map(({ msg }) => msg);
  }

  if (err.type === 'auth') {
    res.status(401).json({ message: 'unauthorized' });
  } else if (err.type === 'username') {
    res.status(400).json({ message: 'username already taken' });
  } else if (err.type === 'input') {
    res.status(400).json({ message: msg || 'invalid input' });
  } else {
    res.status(500).json({ message: "oops, that's on us" });
  }
});

export default app;
