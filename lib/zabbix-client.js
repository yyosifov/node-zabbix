var Q = require('Q'),
	request = require('request');

var ZabbixClient = function(options) {
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

ZabbixClient.prototype.executeRequest = function executeRequest(method, params) {
	var deferred = Q.defer();

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
    }, function (err, response, body) {
        if (err) {
            console.log('request error: ', err);
            return deferred.reject(new Error(err));
        }

        console.log('response[' + response.statusCode + ']: ', body);
        if (response.statusCode == 200 && 'undefined' !== typeof body) {
            try {
                body = JSON.parse(body);

                if (body.error) {
                    err = new Error(body.error);
                }
            } catch (e) {
                err = new Error('Parsing response body failed.');
            }
            
            if(err) {
            	return deferred.reject(new Error(err));
            }
            deferred.resolve(body);

        } else if (response.statusCode == 412) {
        	deferred.reject(new Error('Invalid parameters.'));
        } else {
        	deferred.reject(new Error('Unknown error occured.'));
        }
    }.bind(this));

	return deferred.promise;
};

ZabbixClient.prototype.login = function login(user, password) {
    var deferred = Q.defer();

    var self = this;
    this.executeRequest('user.login', {
            'user': user,
            'password': password
        }).then(function(body) {
            self.AuthenticationId = body.result;
            deferred.resolve(this.AuthenticationId);
        }, deferred.reject);

    return deferred.promise;
};

module.exports = ZabbixClient;
