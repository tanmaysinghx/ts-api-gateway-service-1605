import { Request, Response } from 'express';

import axios from 'axios';
import { getWorkflowCodeByRoute } from '../services/apiGatewayService';

export const handleGatewayRoute = async (req: Request, res: Response) => {
    try {
        const { gearId, version } = req.params;
        const apiPath = req.path.split(`/${gearId}/${version}`)[1]; // extracts dynamic path like /api/auth/register

        const workflowCode = await getWorkflowCodeByRoute({
            gearId,
            apiVersion: version,
            apiPath
        });

        const currentEnv = process.env.NODE_ENV ?? 'LOCAL';
        const workFlowApiVersion = process.env.WORKFLOW_API_VERSION ?? 'v1';
        const workflowUrl = `http://localhost:1606/${workFlowApiVersion}/api/workflow-engine/${version}/${currentEnv}/${workflowCode}`;
        console.log('Forwarding request to:', workflowUrl);
        const result = await axios.post(workflowUrl, req.body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.status(result.status).json(result.data);
    } catch (err: any) {
        if (axios.isAxiosError(err) && err.response) {
            return res.status(err.response.status).json(err.response.data);
        }
        console.error('Gateway Error:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Gateway failed to forward request',
            error: err.message,
        });
    }
};
