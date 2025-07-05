# @microfox/webhook-whatsapp

A TypeScript package for handling WhatsApp Business API webhooks. This package provides a simple way to create a webhook listener, verify webhook authenticity, and process incoming messages and events from WhatsApp.

## Features

- ⚡️ **Webhook verification** for WhatsApp Business API
- 📨 **Message handling** for text and other message types
- 🚀 **Built for serverless environments** like AWS Lambda
- 🛡️ **TypeScript support** with full type safety

## Installation

```bash
npm install @microfox/webhook-whatsapp
# or
yarn add @microfox/webhook-whatsapp
# or
pnpm add @microfox/webhook-whatsapp
```

## Prerequisites

Before using this package, you'll need:

1.  A [WhatsApp Business Account](https://business.whatsapp.com/).
2.  A [Meta for Developers](https://developers.facebook.com/) app.
3.  A verification token for your webhook.
4.  A serverless environment (e.g., AWS Lambda) to host your webhook endpoint.

## Requirements

- Node.js >= 20.0.0
- TypeScript >= 5.6.3

## Quick Start

The following is an example of how to set up a webhook listener using `express`. This is suitable for running in a serverless function.

```typescript
import { WhatsAppWebhook } from '@microfox/webhook-whatsapp';
import express from 'express';
import serverless from 'serverless-http';

const app = express();
app.use(express.json());

const webhook = new WhatsAppWebhook({
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN,
});

// Webhook verification endpoint
app.get('/webhook', (req, res) => {
  const challenge = webhook.verifyGetRequest(req.query);
  if (challenge) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Handle incoming messages
app.post('/webhook', (req, res) => {
  try {
    webhook.on('message', (message) => {
      console.log('Received message:', message);
      // Process your message here
    });

    webhook.process(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.sendStatus(500);
  }
});

export const handler = serverless(app);
```

## Environment Variables

Set these environment variables in your environment:

```bash
WHATSAPP_VERIFY_TOKEN=your_whatsapp_verify_token
```

This token is used to verify that incoming `GET` requests to your webhook endpoint are from Meta.

---
_This is a new package under development. More features and documentation will be added soon._ 