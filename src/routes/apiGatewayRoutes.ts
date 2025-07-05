import { Router, Request, Response, NextFunction } from 'express';
import { handleGatewayRoute } from '../controllers/apiGatewayController';


const router = Router();

router.all('/:gearId/:version/api/*', (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handleGatewayRoute(req, res)).catch(next);
});

export default router;