import AbstractSubscriptionProxy from '../abstract/subscription';

class SubscriptionProxy extends AbstractSubscriptionProxy {
  constructor (config, req){
    const SubscriptionApiClient = require('./../node_modules/subscription-api-vsclient-client').SubscriptionApiClient;
    super(config, req)
    this.api = SubscriptionApiClient(config.subscriptionApi.api, req);
  }
  get (customerToken) {
    return this.api.subscription.get(customerToken);
  }
  products () {
    return this.api.subscription.products();
  }
  coupons () {
    return this.api.subscription.coupons();
  }
  delivery () {
    return this.api.subscription.delivery();
  }
}

module.exports = SubscriptionProxy;
