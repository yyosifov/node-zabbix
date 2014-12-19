var Q = require('Q');

function HostGroup(client) {
    var boundClient = client;

    this.executeRequest = function(operation, data) {
        return boundClient.executeRequest('hostgroup.' + operation, data);
    };
};

HostGroup.prototype.create = function(name) {
	var deferred = Q.defer();

	this.executeRequest('create', {
        name: name
    }).then(function(body) {
    	deferred.resolve(body.result.groupids[0]);
    }, deferred.reject);

    return deferred.promise;
};

HostGroup.prototype.getByName = function(name) {
	var deferred = Q.defer();

    this.executeRequest('get', {
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

        deferred.resolve(body.result.groupids[0]);
    });

    return deferred.promise;
};

module.exports = HostGroup;
