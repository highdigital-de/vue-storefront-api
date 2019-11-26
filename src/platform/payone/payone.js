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
    creditcardcheck(body) {
        console.log('THB: payone/creditcardcheck req body', body);
        console.log('PAYONE CONFIG:', this._config.payone);
        var jmd5 = require("js-md5");
        var obj = {
            aid: this._config.payone.aid, //
            api_version: this._config.payone.api_version, //
            encoding: 'UTF-8', //      .encoding +
            mid: this._config.payone.mid, //
            mode: this._config.payone.mode, //
            portalid: this._config.payone.portalid, //
            request: 'creditcardcheck', //this._config.request + 
            responsetype: 'JSON', //this._config.responsetype +
            storecarddata: 'yes', //this._config.storecarddata +
            hash: ''
        }
        var message = obj.aid + obj.api_version + obj.encoding + obj.mid + obj.mode + obj.portalid + obj.request + obj.responsetype + obj.storecarddata + this._config.payone.key
        console.log('THB: toHash:', message)
        obj.hash = jmd5(message)
        console.log('THB: Hash:', obj.hash)
        console.log(obj)
        return new Promise(function (res) {
            res(obj)
        });

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
        let ref = jmd5(this._config.payone.mid + this._config.payone.portalid + body.amount + this._config.payone.key + time).substr(0, 20)
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

                currency: body.currency, //+
                amount: body.amount, // TODO?? Berechnen
                reference: ref,
                lastname: body.lastname,
                country: body.country,
                clearingtype: body.clearingtype,

            }
        };
        if (body.clearingtype && body.clearingtype == 'elv') {
            options.form = {
                ...options.form,
                iban: body.iban,
                bic: body.bic,
                bankcountry: body.bankcountry
            }

        } else if (body.clearingtype == 'cc') {
            options.form = {
                ...options.form,
                cardtype: body.cardtype,
                cardexpiredate: body.cardexpiredate,
                pseudocardpan: body.pseudocardpan
            }
        } else if (body.clearingtype == 'wlt') {
            options.form = {
                ...options.form,
                wallettype: body.wallettype,
                successurl: body.successurl,
                errorurl: body.errorurl,
                backurl: body.backurl,
            }
        }
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
            (body.iban === 'undefined')) {
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
                iban: body.iban,
                bic: body.bic,
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
}

module.exports = Payone;