export const AwsSesPricingConfig = {
  ['aws-ses']: {
    type: 'api_1',
    outboundEmail: {
      requestCount: {
        basePriceUSD: 0.1,
        dataUnit: 'email',
        per: 1000,
        description: 'Per email sent',
      },
      requestData: {
        basepriceUSD: 0.12, // per GB
        per: 1,
        dataUnit: 'GB', // "GB, MB, KB, B"
        description: 'Per byte of data in the attachments you send',
      },
    },
  },
};
