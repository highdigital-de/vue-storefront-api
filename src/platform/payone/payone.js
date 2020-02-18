import AbstractPayone from '../abstract/payone';

class Payone extends AbstractPayone {
    constructor(config, req) {
      super(config, req)
        this._config = config
    }

    creditcardcheck(body) {
        console.log('THB: payone/creditcardcheck req body', body);
        console.log('PAYONE CONFIG:', this._config.payone);
        var jmd5 = require("js-md5");
        var obj = {
            aid: this._config.payone.aid, //
            api_version: this._config.payone.api_version, //
            encoding: 'UTF-8',
            mid: this._config.payone.mid,
            mode: this._config.payone.mode,
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

    // shut be called authorization
    preauthorization(body) {
        var request = require("request");
        var jmd5 = require("js-md5");
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
                request: 'authorization',
                encoding: 'UTF-8',
                aid: this._config.payone.aid,

                currency: body.currency,
                amount: body.amount, 
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
        } else if (body.clearingtype == 'sb') {
            options.form = {
                ...options.form,
                onlinebanktransfertype: body.onlinebanktransfertype,
                successurl: body.successurl,
                errorurl: body.errorurl,
                backurl: body.backurl,
                iban: body.iban,
                bic: body.bic,
                bankcountry: body.bankcountry
            }
        }
        console.log(options.form);
        return new Promise(function (res) {
            request(options, function (error, response, body) {
                if (error) throw new Error(error)
                console.log('THB: payone/authorization body', body);
                res({ answer: body, reference: ref, time: time })
            });

        });

    }

    managemandate(body) {
        var request = require("request");
        var jmd5 = require("js-md5");
        var hash = jmd5(this._config.payone.key)
        console.log("THB: jmd5 hash:", hash)

        var options = {
            method: 'POST',
            url: 'https://api.pay1.de/post-gateway/',
            headers:
            {
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
                lastname: body.lastname,
                country: body.country,
                bankcountry: body.bankcountry,
                iban: body.iban,
                bic: body.bic,
                city: body.city,
                userid: this.maybe(body.userid)
            }

        };
        console.log(options.form);
        return new Promise(function (res) {
            request(options, function (error, response, body) {
                if (error) throw new Error(error)
                console.log('THB: payone/managemandate body', body);
                res({ answer: body })
            });

        });

    }
    maybe(i){
       return ((i) ? i : ''); 
    }
    updateuser(body) {
        var request = require("request");
        var jmd5 = require("js-md5");
        var hash = jmd5(this._config.payone.key)
        var options = {
            method: 'POST',
            url: 'https://api.pay1.de/post-gateway/',
            headers:
            {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form:
            {    
                // api discription can be found here: 
                // https://docs.payone.com/pages/releaseview.action?pageId=1213913
                mid: this._config.payone.mid,
                portalid: this._config.payone.portalid,
                key: hash,
                api_version: "3.11",
                mode: this._config.payone.mode,
                request: 'updateuser',
                encoding: 'UTF-8',

                // identification
                userid: body.userid,

                // userdata
                salutation: this.maybe(body.salutation),
                title: this.maybe(body.title),
                firstname: this.maybe(body.firstname),
                lastname: this.maybe(body.lastname),

                // parameter: bank account
                iban: this.maybe(body.iban),
                bic: this.maybe(body.bic),
                bankcountry: this.maybe(body.bankcountry),

                // parameter creditcard
                pseudocardpan: this.maybe(body.pseudocardpan),
                cardtype: this.maybe(body.cardtype),
                cardexpiredate: this.maybe(body.cardexpiredate),
            }
        };
        console.log(options.form);
        return new Promise(function (res) {
            request(options, function (error, response, body) {
                if (error) throw new Error(error)
                console.log('THB: payone/updateuser  body', body);
                res({ answer: body })
            });

        });

    }


}

module.exports = Payone;