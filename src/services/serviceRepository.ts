import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createService = async (name: string, url: string) => {
    return await prisma.service.create({
        data: {
            name,
            url,
        },
    });
};

export const logServiceStatus = async (service: string, status: string) => {
    return await prisma.serviceLog.create({
        data: {
            service,
            status,
        },
    });
};

export const getAllServices = async () => {
    return await prisma.service.findMany();
};

export const getAllServiceLogs = async () => {
    return await prisma.serviceLog.findMany();
};
