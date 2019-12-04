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

    paymentPayoneApi.post('/creditcardcheck', (req, res) => {
        const paymentPayone = _getProxy(req)
        console.log('THB: payone creditcardcheck', req);
        paymentPayone.creditcardcheck(req.body).then((result) => {
            res.header("Access-Control-Allow-Origin", "http://localhost:3000"); //TODO nötig?
            res.contentType('application/json');
            res.type('cors');
            result = JSON.stringify(result)
            //console.log('THB: payone API res', res);
            console.log('THB: payone API result:', result)
            apiStatus(res, result, 200);
        }).catch(err => {
            apiStatus(res, err, 500);
        })
    })

    paymentPayoneApi.post('/managemandate', (req, res) => {
        const paymentPayone = _getProxy(req)
        console.log('THB: payone managemandate', req);
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
    })

    paymentPayoneApi.post('/preauthorization', (req, res) => {
        const paymentPayone = _getProxy(req)
        console.log('THB: payone preauthorization', req);
        paymentPayone.preauthorization(req.body).then((result) => {
            apiStatus(res, result, 200);
        }).catch(err => {
            apiStatus(res, err, 500);
        })
    })


    return paymentPayoneApi
}