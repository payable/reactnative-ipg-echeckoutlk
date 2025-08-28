var IPGEnvironment;
(function (IPGEnvironment) {
  IPGEnvironment.dev = 'dev';
  IPGEnvironment.qa = 'qa';
  IPGEnvironment.sandbox = 'sandbox';
  IPGEnvironment.live = 'live';
})(IPGEnvironment || (IPGEnvironment = {}));

export const getEndpoint = (environment) => {
  console.log('environment', environment);
  switch (environment) {
    case IPGEnvironment.dev:
      return 'https://payable-ipg-dev.web.app/ipg/dev';
    case IPGEnvironment.qa:
      return 'https://qaipgpayment.payable.lk/ipg/qa';
    case IPGEnvironment.sandbox:
      return 'https://sandboxipgpayment.payable.lk/ipg/sandbox';
    case IPGEnvironment.live:
      return 'https://ipgpayment.payable.lk/ipg/pro';
    default:
      return 'https://payable-ipg-dev.web.app/ipg/dev';
  }
};
