import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 10 });

export const cacheMiddleware = (req: Request, res: Response, next: NextFunction): any => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);
    if (cachedResponse) {
        return res.json(cachedResponse as any);
    }
    const originalJson = res.json.bind(res);
    res.json = function (body: any): Response<any> {
        cache.set(key, body);
        return originalJson(body);
    };
    next();
};
