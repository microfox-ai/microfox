export const BravePricingConfig = {
  ['brave']: {
    type: 'api_1',
    dataForSearch: {
      requestCount: {
        basePriceUSD: 5,
        dataUnit: 'search',
        per: 1000,
        description: 'Per 1000 search requests',
      },
    },
  },
};
