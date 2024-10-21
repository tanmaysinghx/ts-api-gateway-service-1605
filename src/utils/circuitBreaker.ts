import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const circuitBreaker = async (
    config: AxiosRequestConfig,
    retries = 3
): Promise<AxiosResponse<any>> => {
    try {
        return await axios(config);
    } catch (error) {
        if (retries > 0) {
            console.log('Retrying request...');
            return circuitBreaker(config, retries - 1);
        }
        throw error;
    }
};

