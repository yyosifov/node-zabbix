var Config = require('./Config'),
	ZabbixApi = require('./lib/zabbix-api');

var handleError = function(err) {
    if(typeof err === 'string') {
        return console.log('Error: ' + err);
    }

    console.log(JSON.stringify(err));
};

var zabbixApi = new ZabbixApi(Config.host);
zabbixApi.login(Config.user, Config.password).then(function() {
    zabbixApi.hostgroup.create('yo').then(function(groupId) {
        console.log('groupid = ' + JSON.stringify(groupid));
    }, handleError);

}, handleError);