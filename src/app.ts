import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { limiter } from './middleware/rateLimiter';
import { ipBlocker } from './middleware/ipBlocker';
import { logger } from './middleware/logger';
import authRoutes from './routes/authRoutes';
import healthRoutes from './routes/healthCheckService'
import { endpointLogging } from './middleware/endpointLogging'
import cleanTables from './routes/cleanTables'

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(bodyParser.json());
app.use(helmet());
app.use(logger);
app.use(limiter);
app.use(ipBlocker);
app.use(endpointLogging);

// Routes
app.use('/1625', authRoutes);
app.use('/v2/api', healthRoutes);
app.use('/v2/api', cleanTables)

export default app;
