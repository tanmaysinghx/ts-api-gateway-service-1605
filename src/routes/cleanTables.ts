import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.delete('/clear-tables', async (req: Request, res: Response) => {
    try {
        await prisma.endpointCall.deleteMany({});
        res.status(200).json({
            message: 'Tables cleared successfully.',
        });
    } catch (error) {
        console.error('Error clearing tables:', error);
        res.status(500).json({
            message: 'Error clearing tables',
            error: "Error clearing tables",
        });
    }
});

export default router;
