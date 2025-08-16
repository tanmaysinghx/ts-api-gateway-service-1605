import { Request, Response } from 'express';
import axios from 'axios';
import { getWorkflowCodeByRoute } from '../services/apiGatewayService';
import logger from '../utils/logger';

function resolveRegion(req: Request) {
    return (
        req.query.region as string ||
        req.headers['x-region'] as string ||
        process.env.NODE_ENV ||
        'docker'
    );
}

async function resolveWorkflowCode(req: Request, gearId: string, version: string, apiPath: string) {
    if (req.query.workflowCode) {
        return req.query.workflowCode as string;
    }
    return await getWorkflowCodeByRoute({ gearId, apiVersion: version, apiPath });
}

function resolveApiVersion(req: Request, version: string) {
    return (
        req.query.apiVersion as string ||
        process.env.WORKFLOW_API_VERSION ||
        version ||
        'v1'
    );
}

export const handleGatewayRoute = async (req: Request, res: Response) => {
    try {
        const { gearId, version } = req.params;
        const apiPath = req.path.split(`/${gearId}/${version}`)[1];
        const region = resolveRegion(req);
        const workflowCode = await resolveWorkflowCode(req, gearId, version, apiPath);

        const apiVersion = resolveApiVersion(req, version);

        const workflowUrlPrefix =
            process.env.WORKFLOW_URL_PREFIX || 'http://localhost:1606';

        const workflowUrl = `${workflowUrlPrefix}/${apiVersion}/api/workflow-engine/${workflowCode}?region=${region}&apiVersion=${apiVersion}&method=${req.method}`;

        logger.info(
            `Forwarding [${req.method}] to workflow URL: ${workflowUrl}`
        );

        const forwardedHeaders = {
            'Content-Type': 'application/json',
            ...(req.headers['authorization'] ? { authorization: req.headers['authorization'] } : {})
            // Add any other safe, required headers
        }
        const result = await axios({
            url: workflowUrl,
            method: req.method,
            data: req.body,
            headers: forwardedHeaders,
        });

        return res.status(result.status).json(result.data);

    } catch (err: any) {
        if (axios.isAxiosError(err) && err.response) {
            return res.status(err.response.status).json(err.response.data);
        }
        logger.error(`Gateway failed: ${err.message}`, err);
        return res.status(500).json({
            success: false,
            message: 'Gateway failed to forward request',
            error: err.message,
        });
    }
};