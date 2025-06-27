import { Handler, APIGatewayEvent } from 'aws-lambda';
import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { Redis } from '@upstash/redis';
import { scrape } from './scrape.js';
import dotenv from "dotenv";

dotenv.config();

interface ScrapeRequest {
    url: string;
    jobId: string;
}

const sfn = new SFNClient({});
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export const startScraping: Handler = async (event: APIGatewayEvent) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing request body' }),
        };
    }

    let url: string;
    try {
        const body = JSON.parse(event.body);
        url = body.url;
    } catch (e) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid JSON body' })
        }
    }

    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing "url" in request body' }),
        };
    }

    const jobId = `scrape-${Date.now()}`;
    const input: ScrapeRequest = {
        url,
        jobId,
    };

    // Check if running in serverless-offline
    const isOffline = process.env.IS_OFFLINE || process.env.SERVERLESS_OFFLINE;

    try {
        if (isOffline) {
            // For serverless-offline, directly call the scrape function
            console.log('Running in offline mode, directly invoking scrape function');
            await redis.set(jobId, JSON.stringify({ status: 'PENDING' }));

            // Simulate async execution by calling scrape function directly
            setImmediate(() => {
                scrape(input, {} as any, () => { });
            });
        } else {
            // For actual deployment, use Step Functions
            const params = {
                stateMachineArn: process.env.STATEMACHINE_ARN!,
                input: JSON.stringify(input),
                name: jobId,
            };

            await sfn.send(new StartExecutionCommand(params));
            await redis.set(jobId, JSON.stringify({ status: 'PENDING' }));
        }

        return {
            statusCode: 202,
            body: JSON.stringify({
                message: 'Scraping job started.',
                jobId: jobId,
            }),
        };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to start scraping job.', error: errorMessage }),
        };
    }
};