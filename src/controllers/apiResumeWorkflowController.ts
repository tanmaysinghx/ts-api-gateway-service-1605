import { Request, Response } from 'express';

import axios from 'axios';

export const handleResumeWorkflowRoute = async (req: Request, res: Response): Promise<any> => {
    try {
        const { transactionId } = req.params;
        const workflowUrlPrefix = process.env.WORKFLOW_URL_PREFIX ?? 'http://localhost:1606';
        const resumeWorkflowUrl = `${workflowUrlPrefix}/v1/api/resume-workflow/${transactionId}`;
        const result = await axios.get(resumeWorkflowUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.status(result.status).json(result.data);
    } catch (err: any) {
        if (axios.isAxiosError(err) && err.response) {
            return res.status(err.response.status).json(err.response.data);
        }
        return res.status(500).json({
            success: false,
            message: 'Gateway failed to forward request',
            error: err.message,
        });
    }
}




