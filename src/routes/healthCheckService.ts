import { Router, Request, Response } from 'express';
import { checkServiceHealth } from '../services/healthCheckService';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();

router.get('/gateway/health', cacheMiddleware, async (req: Request, res: Response) => {
    try {
        const healthChecks = await checkServiceHealth();
        res.json({
            status: 'healthy',
            services: healthChecks,
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            message: 'Error performing health check',
        });
    }
});

export default router;

