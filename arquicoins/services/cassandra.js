const cassandra = require('express-cassandra');

function createClient() {
    var models = cassandra.createClient({
        clientOptions: {
            contactPoints: ['127.0.0.1'],
            protocolOptions: { port: 9042 },
            keyspace: 'arquicoins',
            queryOptions: {consistency: cassandra.consistencies.one}
        },
        ormOptions: {
            defaultReplicationStrategy : {
                class: 'SimpleStrategy',
                replication_factor: 1
            },
            migration: 'safe',
            createKeyspace: true
        }
    });
    return models;
}
module.exports = {
    createClient: createClient
};