import cors from 'cors';
import express, { Application, Request, Response } from 'express';
const app: Application = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
  const a = 10;
  res.send(a);
});

export default app;
