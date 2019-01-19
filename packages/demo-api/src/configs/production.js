// @flow
import addDays from "date-fns/add_days";
import MongoDbDriver from "webiny-entity-mongodb";
import { MongoClient } from "mongodb";
import caBundle from "raw-loader!./rds-combined-ca-bundle.pem";

let database = null;
function init() {
    if (database && database.serverConfig.isConnected()) {
        return Promise.resolve(database);
    }

    const server = process.env.MONGODB_SERVER;
    const databaseName = process.env.MONGODB_DB_NAME;

    return MongoClient.connect(
        server,
        { useNewUrlParser: true, sslCA: caBundle }
    ).then(client => {
        return client.db(databaseName);
    });
}

export default async () => {
    database = await init();

    return {
        database: {
            mongodb: database
        },
        entity: {
            // Instantiate entity driver with DB connection
            driver: new MongoDbDriver({ database }),
            crud: {
                logs: true,
                read: {
                    maxPerPage: 1000
                },
                delete: {
                    soft: true
                }
            }
        },
        security: {
            enabled: false,
            token: {
                secret: process.env.WEBINY_JWT_SECRET,
                expiresOn: () => addDays(new Date(), 30)
            }
        }
    };
};
