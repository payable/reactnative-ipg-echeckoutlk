export const IPGEnvironment = {
  // dev: 'dev',
  // qa: 'qa',
  sandbox: 'sandbox',
  live: 'live',
} as const;

export const getEndpoint = (environment: string): string => {
  console.log('environment', environment);

  switch (environment) {
    // case IPGEnvironment.dev:
    //   return 'https://payable-ipg-dev.web.app/ipg/dev';
    // case IPGEnvironment.qa:
    //   return 'https://qaipgpayment.payable.lk/ipg/qa';
    case IPGEnvironment.sandbox:
      return 'https://sandboxipgpayment.echeckout.lk/ipg/sandbox';
    case IPGEnvironment.live:
      return 'https://ipgpayment.echeckout.lk/ipg/pro';
    default:
      return 'https://sandboxipgpayment.echeckout.lk/ipg/sandbox';
  }
};
// const rootUrl = 'https://payable-ipg-dev.web.app';
