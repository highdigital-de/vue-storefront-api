import { apiStatus } from '../lib/util';
import { Router } from 'express';
import PlatformFactory from '../platform/factory';

export default ({ config }) => {

    let paymentPayoneApi = Router();

    const _getProxy = (req) => {
        const platform = 'payone'
        const factory = new PlatformFactory(config, req)
        return factory.getAdapter(platform, 'payone')
    };

	/** 
	 * API1,2,3,5
	 * GET get meta data for subscription
	 */
    paymentPayoneApi.get('/meta', (req, res) => {
        const paymentPayone = _getProxy(req)
        paymentPayone.meta(req.query.token).then((result) => {
            apiStatus(res, result, 200);
        }).catch(err => {
            apiStatus(res, err, 500);
        })
    })
	/**
	 * API4
	 * POST add delivery cicle to cart
	 */
    paymentPayoneApi.post('/post', (req, res) => {
        const paymentPayone = _getProxy(req)
        paymentPayone.post(req.body).then((result) => {
            apiStatus(res, result, 200);
        }).catch(err => {
            apiStatus(res, err, 500);
        })
    })
	/** 
	 * API7
	 * Post get the subscription
	 */
    paymentPayoneApi.get('/get', (req, res) => {
        const paymentPayone = _getProxy(req)
        paymentPayone.get(req.body).then((result) => {
            apiStatus(res, result, 200);
        }).catch(err => {
            apiStatus(res, err, 500);
        })
    })


    return paymentPayoneApi
}