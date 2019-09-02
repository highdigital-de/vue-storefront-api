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
  meta () {
    return this.api.subscription.meta();
  }
  cart_delivery(body) {
    return this.api.subscription.cart_delivery(body);
  }
}

module.exports = SubscriptionProxy;
