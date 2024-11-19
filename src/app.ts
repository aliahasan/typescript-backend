import cors from 'cors';
import express, { Application } from 'express';
import { StudentRoutes } from './app/modules/student/student.route';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// Application routes
app.use('/api/v1/students', StudentRoutes);

export default app;
