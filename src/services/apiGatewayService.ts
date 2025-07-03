import prisma from '../config/db';

export const getWorkflowCodeByRoute = async ({
    gearId,
    apiVersion,
    apiPath
}: {
    gearId: string;
    apiVersion: string;
    apiPath: string;
}) => {
    const mapping = await prisma.workflowRouteMapping.findFirst({
        where: {
            gearId,
            apiVersion,
            apiPath
        }
    });

    if (!mapping) {
        throw new Error(`No workflow found for route: ${apiPath}`);
    }

    return mapping.workflowCode;
};
