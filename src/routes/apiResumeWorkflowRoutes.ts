import { Router, Request, Response, NextFunction } from 'express';
import { handleResumeWorkflowRoute } from '../controllers/apiResumeWorkflowController';

const router = Router();

router.all('/:transactionId', (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handleResumeWorkflowRoute(req, res)).catch(next);
});

export default router;