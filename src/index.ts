import dotenv from 'dotenv';
dotenv.config();

import app from './server';

app.listen(3001, () => console.log('server on port 3001'));
