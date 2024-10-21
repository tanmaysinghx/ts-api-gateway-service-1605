import { Request, Response, NextFunction } from 'express';
import { blockedIPs } from '../utils/blockedIPs';
import ipRangeCheck from 'ip-range-check';

export const ipBlocker = (req: Request, res: Response, next: NextFunction): void => {
    const clientIp = req.ip || '127.0.0.1';
    const isBlocked = blockedIPs.some(blockedIp => ipRangeCheck(clientIp, blockedIp));
    if (isBlocked) {
        res.status(403).json({
            message: 'Access Denied: Your IP has been blocked.'
        });
    } else {
        next();
    }
};
