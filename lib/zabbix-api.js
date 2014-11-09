var request = require('request'),
    Q = require('Q');

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
    var deferred = Q.defer();

    this.call('user.login', {
            'user': user,
            'password': password
        }, function (error, response, body) {
            if (!error) {
                this.AuthenticationId = body.result;
                deferred.resolve(this.AuthenticationId);
            } else {
                deferred.reject(new Error(error));
            }
        }.bind(this)
    );

    return deferred.promise;
};

ZabbixApi.prototype.createHostGroup = function createHostGroup(name, callback) {
    this.call('hostgroup.create', {
        name: name
    }, function(error, res, body) {
        callback(body.result);
    });
};

ZabbixApi.prototype.getHostGroupByName = function getHostGroupByName(name) {
    var deferred = Q.defer();

    this.call('hostgroup.get', {
        output: 'extend',
        filter: {
            name: [
                name
            ]
        }
    }, function(err, res, body) {
        if(err) {
            return deferred.reject(new Error(err));
        }

        deferred.resolve(body.result);
    });

    return deferred.promise;
};

ZabbixApi.prototype.createHost = function createHost(hostName, hostGroupName) {
    var deferred = Q.defer();

    var self = this;
    this.getHostGroupByName(hostGroupName).then(function(hostGroups) {
        var hostGroup = hostGroups[0]; // add checks here;

        self.call('host.create',
            {
               'host': hostName,
               'interfaces': [
                   {
                       'type': 1,
                       'main': 1,
                       'useip': 1,
                       'ip': '192.168.3.1',
                       'dns': '',
                       'port': '10050'
                   }
               ],
               'groups': [
                   {
                       'groupid': hostGroup.groupid
                   }
               ]
            }, function(err, res, body) {
                if(err) {
                    return deferred.reject(new Error(err));
                }

                deferred.resolve(body.result);
            });

    }, function(err) {
        // TODO:
    });

    return deferred.promise;
};

module.exports = ZabbixApi;