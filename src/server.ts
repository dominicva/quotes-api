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

app.use((error, _req, res, _next) => {
  console.error('Error:', error);

  if (error) {
    res.status(400).json({ error: error });
  } else {
    res.status(500).json({ error: "oops, that's on us" });
  }
});

export default app;
