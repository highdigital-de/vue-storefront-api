import AbstractPayone from '../abstract/payone';
import { apiStatus } from 'src/lib/util';


class Payone extends AbstractPayone {
    constructor(config, req) {
        //const SubscriptionApiClient = require('./../node_modules/subscription-api-vsclient-client').SubscriptionApiClient;
        //this.api = SubscriptionApiClient(config.subscriptionApi.api, req);
        super(config, req)
        this._config = config
    }
    meta(body) {
        console.log('payment-payone-meta', body)
        //DO STUFF
        return true;
    }
    preauthorization(body) {
        console.log('THB: payone/preauthorization req body', body);




        console.log('PAYONE CONFIG:', this._config.payone);
        var request = require("request");
        var jmd5 = require("js-md5");
        //console.log('jdm5: ' + jmd5 + '\n' + 'axios: ' + axios);
        var hash = jmd5(this._config.payone.key)
        console.log("THB: jmd5 hash:", hash)
        let time = Date.now();
        console.log(time);
        let ref = jmd5(this._config.payone.mid + this._config.payone.portalid + body.bankaccount + body.bankcode + body.amount + this._config.payone.key + time).substr(0, 20)
        var options = {
            method: 'POST',
            url: 'https://api.pay1.de/post-gateway/',
            headers:
            {
                //'Postman-Token': '3b046af5-23b3-4389-ae9a-7ce011f41a9c',
                //'cache-control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form:
            {
                mid: this._config.payone.mid,
                portalid: this._config.payone.portalid,
                key: hash,
                api_version: "3.11",
                mode: this._config.payone.mode,
                request: 'preauthorization',
                encoding: 'UTF-8',
                aid: this._config.payone.aid,
                clearingtype: 'elv',
                currency: body.currency, //+
                amount: body.amount, // TODO?? Berechnen
                reference: ref,
                lastname: body.lastname,
                country: body.country,
                bankcountry: body.bankcountry,
                bankaccount: body.bankaccount,
                bankcode: body.bankcode,
            }
            //console.log(hash, hash.length)
            //let hash = jmd5(JSON.stringify(settings.data)).substr(0,20);

        };
        console.log(options.form);
        return new Promise(function (res) {
            request(options, function (error, response, body) {
                if (error) throw new Error(error)
                console.log('THB: payone/post  body', body);
                res({ answer: body, reference: ref, time: time })
            });

        });

    }

    managemandate(body) {
        if ((body.currency === 'undefined') ||
            (body.reference === 'undefined') ||
            (body.lastname === 'undefined') ||
            (body.country === 'undefined') ||
            (body.bankcountry === 'undefined') ||
            (body.bankaccount === 'undefined') ||
            (body.bankcode === 'undefined')) {
            throw new Error('Parameter(s) are undefined ' + body)
        }

        console.log('THB: payone/post req body.bankcode', body.bankcode);
        var request = require("request");
        var jmd5 = require("js-md5");
        //console.log('jdm5: ' + jmd5 + '\n' + 'axios: ' + axios);
        var hash = jmd5(this._config.payone.key)
        console.log("THB: jmd5 hash:", hash)

        var options = {
            method: 'POST',
            url: 'https://api.pay1.de/post-gateway/',
            headers:
            {
                //'Postman-Token': '3b046af5-23b3-4389-ae9a-7ce011f41a9c',
                //'cache-control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form:
            {

                mid: this._config.payone.mid,
                portalid: this._config.payone.portalid,
                key: hash,
                api_version: "3.11",
                mode: this._config.payone.mode,
                request: 'managemandate',
                encoding: 'UTF-8',
                aid: this._config.payone.aid,
                clearingtype: 'elv',
                currency: body.currency,
                //amount: '55555', // TODO?? Berechnen
                //reference: '16781', //??  Hashwert Verfahren oder fortlaufende nummer?
                lastname: body.lastname,
                country: body.country,
                bankcountry: body.bankcountry,
                bankaccount: body.bankaccount,
                bankcode: body.bankcode,
                city: body.city
            }

        };
        console.log(options.form);
        return new Promise(function (res) {
            request(options, function (error, response, body) {
                if (error) throw new Error(error)
                //console.log('THB: payone/post response', response);
                console.log('THB: payone/post  body', body);
                res({ answer: body })
            });

        });

    }

    /*post(body) {
        let axios = require('axios');
        console.log('TH:payment-payone-post')
        //console.log(body)
        let config = {
            method: 'post',
            url: "https://api.pay1.de/post-gateway/",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: {
                "mid": "16780",
                "portalid": "2012587",
                "key": "3e94def85fc95e50086db07c48538170",
                "api_version": "3.11",
                "mode": "test",
                "request": "managemandate",
                "encoding": "UTF-8",
                "aid": "17076",
                "clearingtype": "elv",
                "currency": "EUR",
                "amount": "55555",
                "reference": "16781",
                "lastname": "Baier",
                "country": "DE",
                "bankcountry": "DE",
                "bankaccount": "2599100003",
                "bankcode": "12345678",
                "city": "Berlin"
            }
        }

        axios.defaults.withCredentials = true;
        console.log('withCredentials:', axios.defaults.withCredentials);
        axios.post(config.url, config.data, config.headers)
            .then(response => {
                console.log('TH:axios.post response');
                console.log('TH:-----------------------\n')
                console.log('TH:Response from', config.url, '\n', response.data, '\n', response.status, '\n', response.statusText, '\n', response.headers, '\n', response.config);
            }).catch(err => {
                console.log('TH:axios.post error:')
                console.log(err)
            })
        return new Promise(function (res, rej) {
            res('THIS IS A NICE API');
        });

        /*new Promise(function (resolve, reject) {
            axios.postaxios.post(url, settings)
                .then(response => {
                    console.log('Axios', response);
                    console.log(response.json)
                    resolve(response);
                }).catch(err => {
                    console.log(err)
                    reject(false)
                })
        })*/

    //}
    get(body) {
        console.log('payment-payone-get' + body);

        return true;
    }
}

module.exports = Payone;