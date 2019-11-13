import AbstractPayone from '../abstract/payone';

class Payone extends AbstractPayone {
    constructor(config, req) {
        //const SubscriptionApiClient = require('./../node_modules/subscription-api-vsclient-client').SubscriptionApiClient;
        super(config, req)
        //this.api = SubscriptionApiClient(config.subscriptionApi.api, req);
    }
    meta() {
        console.log('payment-payone-meta' + body)
        //DO STUFF
        return true;
    }
    post(body) {
        console.log('payment-payone-post' + body)
        // call api.. 
        //todo: return promise
        return true;
    }
    get(body) {
        console.log('payment-payone-get' + body);

        return true;
    }
}

module.exports = Payone;