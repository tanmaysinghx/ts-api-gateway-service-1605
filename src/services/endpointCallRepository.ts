import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logEndpointCall = async (serviceName: string, endpoint: string, clientIp: string, zone: string, userAgent: string) => {
    await prisma.endpointCall.create({
        data: {
            serviceName,
            endpoint,
            clientIp,
            zone,
            userAgent,
        },
    });
};

export const getEndpointCalls = async (serviceName: string) => {
    return await prisma.endpointCall.findMany({
        where: {
            serviceName,
        },
        orderBy: {
            timestamp: 'desc',
        },
    });
};

