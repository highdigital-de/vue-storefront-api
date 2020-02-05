import jwt from 'jwt-simple';
import { apiStatus } from '../lib/util';
import { Router } from 'express';
import PlatformFactory from '../platform/factory';
import user from './user'

export default ({ config }) => {

	let subscriptionApi = Router();

	const _getProxy = (req) => {
		const platform = config.platformSubscription
		const factory = new PlatformFactory(config, req)
		return factory.getAdapter(platform, 'subscription')
	};

	const _getUserProxy = (req) => {
		const platform = config.platform
		const factory = new PlatformFactory(config, req)
		return factory.getAdapter(platform, 'user')
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
	 * API7
	 * Post get the subscription
	 */
	subscriptionApi.post('/get', (req, res) => {
		const userProxy = _getUserProxy(req)
		let userId
		userProxy.me(req.query.token).then((result) => {
			userId = result.id
			const body = {
				query: {
					customer_id: userId
				}
			}
			const subscriptionProxy = _getProxy(req)
			subscriptionProxy.get(body).then((result) => {
				apiStatus(res, result, 200);
			}).catch(err => {
				apiStatus(res, err, 500);
			})
		}).catch(err => {
			apiStatus(res, err, 401);
			return
		})
	})
	/** 
	 * API8
	 * POST delete subscription
	 */
	subscriptionApi.post('/delete', (req, res) => {
		let token = req.query.token
		console.log('get user for token', token)
		const userProxy = _getUserProxy(req)
		let userId
		userProxy.me(req.query.token).then((result) => {
			userId = result.id
			const body = {
				query: {
					customer_id: userId
				}
			}
			console.log('body', body)
			const subscriptionProxy = _getProxy(req)
			subscriptionProxy.delete(body).then((result) => {
				apiStatus(res, result, 200);
			}).catch(err => {
				apiStatus(res, err, 500);
			})
		}).catch(err => {
			console.log('error, not authenticated', err)
			apiStatus(res, err, 401);
			return
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
		let token = req.query.token
		const userProxy = _getUserProxy(req)
		let userId
		userProxy.me(req.query.token).then((result) => {
			userId = result.id
			const body = {
				query: {
					...req.body,
					customer_id: userId
				}
			}
			const subscriptionProxy = _getProxy(req)
			subscriptionProxy.update(body).then((result) => {
				apiStatus(res, result, 200);
			}).catch(err => {
				apiStatus(res, err, 500);
			})
		}).catch(err => {
			apiStatus(res, err, 401);
			return
		})
	})
	/** 
	 * API12
	 * POST create subscription
	 */
	subscriptionApi.post('/create', (req, res) => {
		const subscriptionProxy = _getProxy(req)
		subscriptionProxy.create(req.body).then((result) => {
			apiStatus(res, result, 200);
		}).catch(err => {
			apiStatus(res, err, 500);
		})
	})

	return subscriptionApi
}
