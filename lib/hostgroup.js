var Q = require('Q');

function HostGroup(client) {
	this.client = client;
};

HostGroup.prototype.create = function(name) {
	var deferred = Q.defer();

	this.client.call('hostgroup.create', {
        name: name
    }).then(function(body) {
    	deferred.resolve(body.result.groupids[0]);
    }, deferred.reject);

    return deferred.promise;
};

HostGroup.prototype.getByName = function(name) {
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

        deferred.resolve(body.result.groupids[0]);
    });

    return deferred.promise;
};

module.exports = HostGroup;