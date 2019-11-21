import { apiStatus } from '../lib/util';
import { Router } from 'express';
import PlatformFactory from '../platform/factory';
import { json } from 'body-parser';

export default ({ config }) => {

    let paymentPayoneApi = Router();

    const _getProxy = (req) => {
        const platform = 'payone'
        const factory = new PlatformFactory(config, req)
        return factory.getAdapter(platform, 'payone')
    };

	/** 
	 * API1
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
	 * API2
	 */
    paymentPayoneApi.post('/managemandate', (req, res) => {
        const paymentPayone = _getProxy(req)
        console.log('THB: payone API req.body', req);
        paymentPayone.managemandate(req.body).then((result) => {
            res.header("Access-Control-Allow-Origin", "http://localhost:3000");
            res.contentType('application/json');
            res.type('cors');
            result = JSON.stringify(result)
            //console.log('THB: payone API res', res);
            //console.log('THB: payone API result:', result)
            apiStatus(res, result, 200);
        }).catch(err => {
            apiStatus(res, err, 500);
        })
    })/*
    paymentPayoneApi.post('/post1', (req, res) => {
        const paymentPayone = _getProxy(req)
        paymentPayone.post1(req.body).then((result) => {
            apiStatus(res, result, 200);
        }).catch(err => {
            apiStatus(res, err, 500);
        })
    })*/
	/** 
	 * API3
	 */
    paymentPayoneApi.post('/preauthorization', (req, res) => {
        const paymentPayone = _getProxy(req)
        console.log('THB: payone API req.body', req);
        paymentPayone.preauthorization(req.body).then((result) => {
            apiStatus(res, result, 200);
        }).catch(err => {
            apiStatus(res, err, 500);
        })
    })


    return paymentPayoneApi
}