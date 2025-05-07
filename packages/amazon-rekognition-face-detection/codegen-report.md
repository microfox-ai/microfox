# Packagefox: Code Generation Report

## Generated Files
| File | Size (bytes) |
|------|-------------|
| src/AmazonRekognitionFaceDetectionSdk.ts | 3854 |
| src/types/index.ts | 4750 |
| src/schemas/index.ts | 916 |
| src/index.ts | 154 |

## Setup Information
- **Auth Type**: apikey


- **Setup Info**: To use this SDK, you need to set up AWS credentials:

1. Create an AWS account if you don't have one.
2. Create an IAM user with permissions to access Amazon Rekognition.
3. Generate an access key ID and secret access key for the IAM user.
4. Set up your credentials using one of the following methods:
   a. Environment variables:
      - Set AWS_ACCESS_KEY_ID to your access key ID
      - Set AWS_SECRET_ACCESS_KEY to your secret access key
      - Set AWS_REGION to your desired AWS region (e.g., 'us-east-1')
   b. Shared credentials file:
      - Create a file at ~/.aws/credentials (Linux/Mac) or C:\Users\USERNAME\.aws\credentials (Windows)
      - Add your credentials in the following format:
        [default]
        aws_access_key_id = YOUR_ACCESS_KEY_ID
        aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
      - Set the AWS_REGION environment variable or pass it to the SDK constructor

Make sure to keep your credentials secure and never commit them to version control.

This SDK uses the AWS Signature Version 4 for authentication, which is handled automatically when you provide your credentials.



---
**Total Usage:** Total Bytes: 9674 | Tokens: 423993 | Cost: $1.7035