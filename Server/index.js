import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { AdminRoute } from './src/interfaces/routes/AdminRoute.js';
import { EmployeeRoute } from './src/interfaces/routes/EmployeeRoute.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/admin', AdminRoute);
app.use('/employee', EmployeeRoute);
app.use(express.static('Public'));
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

