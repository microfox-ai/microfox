import { SQSEvent } from 'aws-lambda';

export function createMockSQSEvent(messageBody: object): SQSEvent {
  return {
    Records: [
      {
        messageId: 'offline-mock-message-id',
        receiptHandle: 'offline-mock-receipt-handle',
        body: JSON.stringify(messageBody),
        attributes: {
          ApproximateReceiveCount: '1',
          SentTimestamp: new Date().getTime().toString(),
          SenderId: 'offline-mock-sender-id',
          ApproximateFirstReceiveTimestamp: new Date().getTime().toString(),
        },
        messageAttributes: {},
        md5OfBody: 'offline-mock-md5',
        eventSource: 'aws:sqs',
        eventSourceARN: 'offline-mock-arn',
        awsRegion: 'us-east-1',
      },
    ],
  };
}
