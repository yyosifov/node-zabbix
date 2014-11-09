var Config = require('./Config'),
	ZabbixApi = require('./lib/zabbix-api');

var zabbixApi = new ZabbixApi(Config.host);
zabbixApi.login(Config.user, Config.password).then(function() {
    zabbixApi.createHost('yo', 'EverliveApiTest').then(function(res) {
        console.log('host "yo" is created');
    }, function(err) {
        // TODO:
    });
    /*zabbixApi.createHostGroup('yo', function(groupId) {
        console.log(JSON.stringify(groupId));
    });*/
}, function(err) {
    console.log(err.message)
});