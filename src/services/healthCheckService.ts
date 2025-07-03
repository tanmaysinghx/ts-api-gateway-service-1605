import axios from 'axios';

interface ServiceStatus {
    status: string;
    uptime: string;
    lastChecked: string;
}

interface Service {
    name: string;
    url: string;
}

const serviceStatus: { [key: string]: ServiceStatus } = {};
const prefix = process.env.SERVICE_PREFIX || 'local';

const services: Service[] = [
    {
        name: 'ts-auth-service-1625',
        url: 'http://${prefix}/v2/api/health/health-check',
    },
    {
        name: 'ts-tms-service-1666',
        url: 'http://localhost:1666/health',
    }
];

export const checkServiceHealth = async () => {
    const healthChecks = await Promise.all(
        services.map(async (service) => {
            try {
                const response = await axios.get(service.url);
                serviceStatus[service.name] = {
                    status: response.status === 200 ? 'healthy' : 'unhealthy',
                    uptime: response.data.uptime || 'unknown',
                    lastChecked: new Date().toISOString(),
                };
            } catch (error) {
                console.error(`Error checking health for service ${service.name}:`, error);
                serviceStatus[service.name] = {
                    status: 'unhealthy',
                    uptime: '0 hours',
                    lastChecked: new Date().toISOString(),
                };
            }
            return {
                name: service.name,
                status: serviceStatus[service.name].status,
                uptime: serviceStatus[service.name].uptime,
                lastChecked: serviceStatus[service.name].lastChecked,
            };
        })
    );
    return healthChecks;
};
