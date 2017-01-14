var debugLogger = require('debug-logger');
module.exports = (name = 'app') => {
    return debugLogger(name);
};
