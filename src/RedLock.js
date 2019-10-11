require('dotenv').config();
const Redlock = require('redlock');
const client = require('redis').createClient(process.env.REDIS_PORT, process.env.REDIS_ENDPOINT);

module.exports = new Redlock([client], {
    driftFactor: 0.01, // time in ms

    // the max number of times Redlock will attempt
    // to lock a resource before erroring
    retryCount:  50,

    // the time in ms between attempts
    retryDelay:  200, // time in ms

    // the max time in ms randomly added to retries
    // to improve performance under high contention
    // see https://www.awsarchitectureblog.com/2015/03/backoff.html
    retryJitter:  200 // time in ms
});
