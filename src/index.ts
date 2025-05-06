import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes';

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running');
});

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});