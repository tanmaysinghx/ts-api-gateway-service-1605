import axios from 'axios';
import { Router, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import serviceUrls from '../data/url-list.json';
import { verifyToken } from '../middleware/authMiddleware';
dotenv.config();

const router = Router();

type ServiceUrls = {
    local: {
        notificationService: string;
    };
    production: {
        notificationService: string;
    };
};

const urls: ServiceUrls = serviceUrls as ServiceUrls;

type EnvKeys = 'local' | 'production';

const env: EnvKeys = (process.env.ENV as EnvKeys) || 'local';
const baseUrl = urls[env].notificationService;

// Define endpoints that require token verification
const endpointsThatRequireToken = [
    '/auth-service/v2/api/auth/change-password',
    // Add more protected endpoints as needed
];

const conditionalVerifyToken = (req: Request, res: Response, next: NextFunction) => {
    const requestPath = req.path;
    if (endpointsThatRequireToken.some(endpoint => requestPath.startsWith(endpoint))) {
        return verifyToken(req, res, next);
    }
    next();
};

router.all('/notification-service/*', conditionalVerifyToken, async (req: Request, res: Response) => {
    const url = `${baseUrl}${req.path.replace('/notification-service', '')}`;
    try {
        const axiosOptions = {
            method: req.method.toLowerCase(),
            url: url,
            headers: { 'Content-Type': req.headers['content-type'] },
            data: req.method === 'GET' ? undefined : req.body,
        };
        const response = await axios(axiosOptions);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error while proxying request:');
        if (axios.isAxiosError(error) && error.response) {
            // Forward the status and data from the microservice
            res.status(error.response.status).json(error.response.data);
        } else {
            // Handle unexpected errors
            res.status(500).json({ error: 'Proxy error occurred' });
        }
    }
});


export default router;
