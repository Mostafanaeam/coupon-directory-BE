import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

app.listen(Number(port), () => {
  console.log(`Server is running on port ${port}`);
});
