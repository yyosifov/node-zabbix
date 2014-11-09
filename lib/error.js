var message = '';
var Error = function(msg) {
    message = msg;
};

Error.prototype.getMessage = function() {
    return message;
};

module.expots = Error;