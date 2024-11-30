import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/errorHandler';
import handleNotFoundRoute from './app/middleware/notFound';
import router from './app/routes';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the University API' });
});

// not found route
app.use(handleNotFoundRoute);
app.use(globalErrorHandler);
export default app;
