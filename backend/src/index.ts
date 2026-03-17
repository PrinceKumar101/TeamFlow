import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDb from './config/db.js';
import {
  errorMiddleware,
} from './utils/utilityFunctions.js';
import router from './routes/index.js';
import { seedDummyUsers } from './seeds/users.seed.js';

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);
connectDb().then(() => seedDummyUsers()).catch(console.error);
app.use(morgan('dev'));

app.use("/api-v1", router)
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Frontend Url ${process.env.CORS_ORIGIN}`);
  console.log(`Example app listening on port ${port}`);
});
