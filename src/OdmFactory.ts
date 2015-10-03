import {ConnectionOptions} from "./connection/ConnectionOptions";
import {MongodbDriver} from "./driver/MongodbDriver";
import {ConnectionManager} from "./connection/ConnectionManager";
import {Connection} from "./connection/Connection";

/**
 * Provides quick functions for easy-way of performing some commonly making operations.
 */
export class OdmFactory {

    /**
     * Global connection manager.
     */
    static mongodbConnectionManager: ConnectionManager = new ConnectionManager();

    /**
     * Creates a new connection to mongodb. Imports documents and subscribers from the given directories.
     */
    static createMongodbConnection(url: string, documentDirectories: string[], subscriberDirectories?: string[]): Promise<Connection>;
    static createMongodbConnection(options: ConnectionOptions, documentDirectories: string[], subscriberDirectories?: string[]): Promise<Connection>;
    static createMongodbConnection(configuration: string|ConnectionOptions, documentDirectories: string[], subscriberDirectories?: string[]): Promise<Connection> {
        if (typeof configuration === 'string') {
            configuration = { url: <string> configuration };
        }

        this.mongodbConnectionManager.addConnection(new MongodbDriver(require('mongodb')));
        this.mongodbConnectionManager.importDocumentsFromDirectories(documentDirectories);
        if (subscriberDirectories && subscriberDirectories.length > 0)
            this.mongodbConnectionManager.importSubscribersFromDirectories(subscriberDirectories);

        return this.mongodbConnectionManager.getConnection().connect(<ConnectionOptions> configuration);
    }

}
