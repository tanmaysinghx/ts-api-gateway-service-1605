import { Request, Response, NextFunction } from 'express';
import { logEndpointCall } from '../services/endpointCallRepository';
import geoip from 'geoip-lite';

export const endpointLogging = async (req: Request, res: Response, next: NextFunction) => {
    const serviceName = req.baseUrl;
    const endpoint = req.originalUrl;
    const clientIp = req.ip || 'unknown';
    const geo = geoip.lookup(clientIp);
    let zone: string;
    if (geo) {
        zone = `${geo.country}, ${geo.region}, ${geo.city}`;
    } else {
        console.log('Geolocation not found');
        zone = "NOT FOUND";
    }
    const userAgent = req.headers['user-agent'] || 'unknown';
    try {
        await logEndpointCall(serviceName, endpoint, clientIp, zone, userAgent);
    } catch (error) {
        console.error('Error logging endpoint call:', error);
    }
    next();
};

