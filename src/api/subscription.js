import { apiStatus } from '../lib/util';
import { Router } from 'express';
import PlatformFactory from '../platform/factory';

export default ({ config }) => {

	let subscriptionApi = Router();
	
	const _getProxy = (req) => {
		const platform = config.platformSubscription
		const factory = new PlatformFactory(config, req)
		return factory.getAdapter(platform, 'subscription')
	};

	/** 
	 * API1,2,3,5
	 * GET get meta data for subscription
	 */
	subscriptionApi.get('/meta', (req, res) => {
		const subscriptionProxy = _getProxy(req)
    subscriptionProxy.meta(req.query.token).then((result) => {
			apiStatus(res, result, 200);
		}).catch(err => {
			apiStatus(res, err, 500);
		})
	})
	/**
	 * API4
	 * POST add delivery cicle to cart
	 */
	subscriptionApi.post('/cart/delivery', (req, res) => {
		const subscriptionProxy = _getProxy(req)
    subscriptionProxy.cart_delivery(req.body).then((result) => {
			apiStatus(res, result, 200);
		}).catch(err => {
			apiStatus(res, err, 500);
		})
	})
	/** 
	 * API6
	 * Post change payment method
	 */
	subscriptionApi.post('/paymentmethod/update', (req, res) => {
		const subscriptionProxy = _getProxy(req)
    subscriptionProxy.paymentmethod_update(req.body).then((result) => {
			apiStatus(res, result, 200);
		}).catch(err => {
			apiStatus(res, err, 500);
		})
	})
	/** 
	 * API7
	 * Post get the subscription
	 */
	subscriptionApi.post('/get', (req, res) => {
		const subscriptionProxy = _getProxy(req)
    subscriptionProxy.get(req.body).then((result) => {
			apiStatus(res, result, 200);
		}).catch(err => {
			apiStatus(res, err, 500);
		})
	})
	/** 
	 * API8
	 * POST delete subscription
	 */
	subscriptionApi.post('/delete', (req, res) => {
		const subscriptionProxy = _getProxy(req)
    subscriptionProxy.cart_delivery(req.body).then((result) => {
			apiStatus(res, result, 200);
		}).catch(err => {
			apiStatus(res, err, 500);
		})
	})
	/** 
	 * API9
	 * POST change delivery
	 */
	subscriptionApi.post('/delivery', (req, res) => {
		const subscriptionProxy = _getProxy(req)
    subscriptionProxy.cart_delivery(req.body).then((result) => {
			apiStatus(res, result, 200);
		}).catch(err => {
			apiStatus(res, err, 500);
		})
	})
	/** 
	 * API11
	 * POST update subscription
	 */
	subscriptionApi.post('/update', (req, res) => {
		const subscriptionProxy = _getProxy(req)
    subscriptionProxy.update(req.body).then((result) => {
			apiStatus(res, result, 200);
		}).catch(err => {
			apiStatus(res, err, 500);
		})
	})

	return subscriptionApi
}
