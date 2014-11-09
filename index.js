var request = require('request'),
	ZabbixApi = require('./lib/zabbix-api');

var zapi = new ZabbixApi('zabbix-uri/api_jsonrpc.php');
zapi.login('Yosif', 'Kasa bira!', function(err, res, body) {
    // after login execute any method from the api...

    zapi.createHostGroup('yo', function(groupId) {
        console.log(JSON.stringify(groupId));
    });
});
