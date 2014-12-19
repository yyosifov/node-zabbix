var request = require('request'),
    Q = require('Q'),
    ZabbixClient = require('./zabbix-client'),
    ZabbixResourceClient = require('./zabbix-resource-client'),
    Resources = require('./resources');

var ZabbixApi = function (options) {
    this.client = new ZabbixClient(options);

    // Resource Clients
    this.hostgroup = new ZabbixResourceClient(this.client, Resources.hostgroup);
};

ZabbixApi.prototype.login = function(user, pass) {
    return this.client.login(user, pass);
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
