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
    static createMongodbConnection(options: string, documentDirectories: string[]|Function[], subscriberDirectories?: string[]): Promise<Connection>;
    static createMongodbConnection(options: ConnectionOptions, documentDirectories: string[]|Function[], subscriberDirectories?: string[]): Promise<Connection>;
    static createMongodbConnection(configuration: string|ConnectionOptions, documentDirectories: string[]|Function[], subscriberDirectories?: string[]): Promise<Connection> {
        if (typeof configuration === "string") {
            configuration = { url: <string> configuration };
        }

        this.mongodbConnectionManager.addConnection(new MongodbDriver());

        if (documentDirectories && documentDirectories.length > 0) {
            if (typeof documentDirectories[0] === "string") {
                this.mongodbConnectionManager.importDocumentsFromDirectories(<string[]> documentDirectories);
            } else {
                this.mongodbConnectionManager.importDocuments(<Function[]> documentDirectories);
            }
        }

        if (subscriberDirectories && subscriberDirectories.length > 0){
            this.mongodbConnectionManager.importSubscribersFromDirectories(subscriberDirectories);
        }

        return this.mongodbConnectionManager.getConnection().connect(<ConnectionOptions> configuration);
    }

}
