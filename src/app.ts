import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { limiter } from './middleware/rateLimiter';
import { ipBlocker } from './middleware/ipBlocker';
import { logger } from './middleware/logger';
import healthRoutes from './routes/healthCheckService'
import { endpointLogging } from './middleware/endpointLogging'
import cleanTables from './routes/cleanTables'
import apiGatewayRoutes from './routes/apiGatewayRoutes';
import apiResumeWorkflowRoutes from './routes/apiResumeWorkflowRoutes';

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

app.use('/api-gateway', apiGatewayRoutes);
app.use('/api-gateway/resume-workflow', apiResumeWorkflowRoutes);
app.use('/v2/api', healthRoutes);
app.use('/v2/api', cleanTables)

export default app;
