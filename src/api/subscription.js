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
	 * GET get the subscription
	 *   req.query.token - user token
	 */
	subscriptionApi.get('/get', (req, res) => {
		const subscriptionProxy = _getProxy(req)
    subscriptionProxy.get(req.query.token).then((result) => {
			apiStatus(res, result, 200);
		}).catch(err => {
			apiStatus(res, err, 500);
		})
	})
	/** 
	 * GET get the subscribable products
	 */
	subscriptionApi.get('/products', (req, res) => {
		const subscriptionProxy = _getProxy(req)
    subscriptionProxy.products(req.query.token).then((result) => {
			apiStatus(res, result, 200);
		}).catch(err => {
			apiStatus(res, err, 500);
		})
	})
	/** 
	 * GET get the coupons
	 */
	subscriptionApi.get('/coupons', (req, res) => {
		const subscriptionProxy = _getProxy(req)
    subscriptionProxy.coupons(req.query.token).then((result) => {
			apiStatus(res, result, 200);
		}).catch(err => {
			apiStatus(res, err, 500);
		})
	})
	/** 
	 * GET get delivery options
	 */
	subscriptionApi.get('/delivery', (req, res) => {
		const subscriptionProxy = _getProxy(req)
    subscriptionProxy.delivery(req.query.token).then((result) => {
			apiStatus(res, result, 200);
		}).catch(err => {
			apiStatus(res, err, 500);
		})
	})

	return subscriptionApi
}
