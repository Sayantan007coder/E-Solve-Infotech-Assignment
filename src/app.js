import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.js';
import caseRoutes from './routes/caseRoutes.js';
import authRoutes from './routes/authRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/cases', caseRoutes);
app.use('/auth', authRoutes);
app.use('/analytics', analyticsRoutes);

app.use(errorMiddleware);

export default app;