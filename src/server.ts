import express from 'express';
import morgan from 'morgan';
import { protect } from './modules/auth';
import router from './router';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'hello world' });
});

app.use('/api', protect, router);

export default app;
