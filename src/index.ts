import dotenv from 'dotenv';
dotenv.config();
import config from './config';
import app from './server';

app.listen(config.port, () => console.log(`running on port ${config.port} `));
