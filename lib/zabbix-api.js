var Error = require('./error.js'),
    request = require('request');

var host;

var ZabbixApi = function (options) {
    if (!options) {
        throw new Error('Invalid zabbix api configuration.');
    }

    if (typeof options === 'string') {
        this.host = options;
    } else {
        if (!options || !options.host) {
            throw new Error('Invalid configuration options - host is a required parameter.');
        }

        this.host = options.host;
    }

    this.rpcid = 0;
};

ZabbixApi.prototype.call = function call(method, params, callback) {
    console.log('method: ', method, ' params: ', JSON.stringify(params));

    request({
        method: 'POST',
        uri: this.host,
        headers: { 'content-type': 'application/json-rpc' },
        body: JSON.stringify({
            id: ++this.rpcid,
            jsonrpc: '2.0',
            auth: this.AuthenticationId,
            method: method,
            params: params
        })
    }, function (error, response, body) {
        if (error) {
            console.log('request error: ', error);
            return callback(error, response, body);
        }

        console.log('response[' + response.statusCode + ']: ', body);
        if (response.statusCode == 200 && 'undefined' !== typeof body) {
            error = null;
            try {
                body = JSON.parse(body);

                if (body.error) {
                    error = new Error(body.error);
                }
            } catch (e) {
                error = new Error('Parsing response body failed.');
            }
            // result can also be an error.
            callback(error, response, body);
        } else if (response.statusCode == 412) {
            callback(new Error('Invalid parameters.'), response, body);
        } else {
            callback(new Error('Something else went wrong'), response, body);
        }
    }.bind(this));
};

ZabbixApi.prototype.login = function login(user, password, callback) {
    this.call('user.login', {
            'user': user,
            'password': password
        }, function (error, response, body) {
            if (!error) {
                this.AuthenticationId = body.result;
            }

            if(callback) {
                callback(error, response, body);
            }
        }.bind(this)
    );
};

ZabbixApi.prototype.createHostGroup = function createHostGroup(name, callback) {
    this.call('hostgroup.create', {
        name: name
    }, function(error, res, body) {
        callback(body.result);
    });
};

module.exports = ZabbixApi;