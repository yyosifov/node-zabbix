/**
 * Represents a single resource in the Zabbix. Defines most methods for all resources - not all of them are applicable for every resource.
 * @param client
 * @param resource
 * @constructor
 */
var ZabbixResourceClient = function(client, resource) {
    this.client = client;
    this.resource = resource;
};

ZabbixResourceClient.prototype.getMethodName = function(operation) {
    return this.resource + '.' + operation;
};

ZabbixResourceClient.prototype.create = function(data) {
    return this.client.executeRequest(this.getMethodName('create'), data);
};

ZabbixResourceClient.prototype.delete = function(data) {
    return this.client.executeRequest(this.getMethodName('delete'), data);
};

ZabbixResourceClient.prototype.get = function(data) {
    return this.client.executeRequest(this.getMethodName('get'), data);
};

ZabbixResourceClient.prototype.exists = function(data) {
    return this.client.executeRequest(this.getMethodName('exists'), data);
};

ZabbixResourceClient.prototype.update = function(data) {
    return client.executeRequest(this.getMethodName('update'), data);
};

module.exports = ZabbixResourceClient;
