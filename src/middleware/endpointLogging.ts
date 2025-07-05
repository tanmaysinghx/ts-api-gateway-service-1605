import { Request, Response, NextFunction } from 'express';
import geoip from 'geoip-lite';
import { logEndpointCall } from '../services/endpointCallRepository';

export const endpointLogging = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const serviceName = req.baseUrl || 'unknown-service';
        const endpoint = req.originalUrl || req.url;

        let clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
            req.socket.remoteAddress ?? 'unknown';
        // Remove IPv6 prefix if exists (::ffff:)
        if (clientIp.startsWith('::ffff:')) {
            clientIp = clientIp.replace('::ffff:', '');
        }
        let geo = geoip.lookup(clientIp);
        let zone: string;
        if (geo) {
            zone = [geo.country, geo.region, geo.city].filter(Boolean).join(', ');
        } else if (clientIp === '127.0.0.1' || clientIp === '::1') {
            zone = 'LOCALHOST';
        } else {
            zone = 'UNKNOWN';
        }
        const userAgent = req.headers['user-agent'] ?? 'unknown';

        await logEndpointCall(serviceName, endpoint, clientIp, zone, userAgent);
    } catch (error) {
        console.error('⚠️ Error logging endpoint call:', error);
    }
    next();
};
