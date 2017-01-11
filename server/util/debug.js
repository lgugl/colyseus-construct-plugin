var debugLogger = require('debug-logger');
module.exports = (name = 'master') => {
    return debugLogger(name);
};
