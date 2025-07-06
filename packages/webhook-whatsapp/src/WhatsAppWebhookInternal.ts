// import { EventEmitter } from 'events';
// import { WhatsAppWebhookPayloadSchema, WhatsAppMessage, WhatsAppWebhookPayload } from './types';

// interface WhatsAppWebhookOptions {
//   verifyToken?: string;
// }

// export class WhatsAppWebhook extends EventEmitter {
//   private verifyToken: string;

//   constructor(options: WhatsAppWebhookOptions = {}) {
//     super();
//     this.verifyToken = options.verifyToken || process.env.WHATSAPP_VERIFY_TOKEN || '';
//     if (!this.verifyToken) {
//       throw new Error('WhatsApp verify token is not provided.');
//     }
//   }

//   public verifyGetRequest(query: any): string | false {
//     const mode = query['hub.mode'];
//     const token = query['hub.verify_token'];
//     const challenge = query['hub.challenge'];

//     if (mode === 'subscribe' && token === this.verifyToken) {
//       return challenge;
//     }
//     return false;
//   }

//   public process(payload: any): void {
//     try {
//       const parsedPayload: WhatsAppWebhookPayload = WhatsAppWebhookPayloadSchema.parse(payload);

//       parsedPayload.entry.forEach(entry => {
//         entry.changes.forEach(change => {
//           if (change.field === 'messages' && change.value.messages) {
//             change.value.messages.forEach(message => {
//               this.emit('message', message);
//             });
//           }
//         });
//       });

//     } catch (error) {
//       this.emit('error', error);
//     }
//   }

//   public on(event: 'message', listener: (message: WhatsAppMessage) => void): this;
//   public on(event: 'error', listener: (error: Error) => void): this;
//   public on(event: string | symbol, listener: (...args: any[]) => void): this {
//     return super.on(event, listener);
//   }
// }
