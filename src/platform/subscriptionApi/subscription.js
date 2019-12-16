import AbstractSubscriptionProxy from '../abstract/subscription';

class SubscriptionProxy extends AbstractSubscriptionProxy {
  constructor (config, req){
    const SubscriptionApiClient = require('./../node_modules/subscription-api-vsclient-client').SubscriptionApiClient;
    super(config, req)
    this.api = SubscriptionApiClient(config.subscriptionApi.api, req);
  }
  meta () {
    return this.api.subscription.meta();
  }
  cart_delivery(body) {
    return this.api.subscription.cart_delivery(body);
  }
  get (body) {
    return this.api.subscription.get(body);
  }
  delete(body) {
    return this.api.subscription.delete(body);
  }
  delivery(body) {
    return this.api.subscription.delivery(body);
  }
  update(body) {
    return this.api.subscription.update(body);
  }
}

module.exports = SubscriptionProxy;
