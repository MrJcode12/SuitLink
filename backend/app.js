import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import db from './database/db.js';

import authRouter from './routes/auth.routes.js';
import companyProfileRouter from './routes/companyProfile.routes.js';
import applicantProfileRouter from './routes/applicantProfile.routes.js';
import jobPostingRouter from './routes/jobPosting.routes.js';
import jobApplicationRouter from './routes/jobApplication.routes.js';
import notificationRouter from './routes/notification.routes.js';

dotenv.config();
const app = express();

db(); 

app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(cookieParser());



app.use('/api/v1/auth/', authRouter);
app.use('/api/v1/company/', companyProfileRouter);
app.use('/api/v1/applicant/', applicantProfileRouter);
app.use('/api/v1/jobs', jobPostingRouter);
app.use('/api/v1/applications', jobApplicationRouter);
app.use('/api/v1/notifications', notificationRouter);


app.get('/', (req, res) => {
  res.send('Welcome to SuitLink API!')
})

export default app;