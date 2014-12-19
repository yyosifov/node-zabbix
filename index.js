var Config = require('./Config'),
	ZabbixApi = require('./lib/zabbix-api');

/**
 * Handle an error - log it to the Output
 * @param err
 * @returns {*}
 */
var handleError = function(err) {
    if(typeof err === 'string') {
        return console.log('Error: ' + err);
    }

    console.log(JSON.stringify(err));
};

var zabbixApi = new ZabbixApi(Config.host);
// Authenticate to the Zabbix
zabbixApi.login(Config.user, Config.password).then(function() {

    // create a host group if it does not exist
    zabbixApi.hostgroup.exists({
        name: 'yo'
    }).then(function(data) {
        var exists = data.result;
        if(!exists) {
            // create new host group
            zabbixApi.hostgroup.create({
                name: 'yo'
            }).then(function(groupId) {
                console.log('Group Id = ' + JSON.stringify(groupId));
            }, handleError);
        }
    }, handleError);
}, handleError);
