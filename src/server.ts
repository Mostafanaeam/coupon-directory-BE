import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

// CORS configuration - allow frontend domain
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5000',
    'https://coupon-directory-plus.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

export default app;
