import {Connection} from "./Connection";
import {OdmUtils} from "../util/OdmUtils";
import {defaultMetadataStorage} from "../metadata-builder/MetadataStorage";
import {SchemaBuilder} from "../schema/SchemaBuilder";
import {Driver} from "../driver/Driver";
import {DefaultNamingStrategy} from "../naming-strategy/DefaultNamingStrategy";
import {MetadataAggregationBuilder} from "../metadata-builder/MetadataAggregationBuilder";
import {ConnectionNotFoundError} from "./error/ConnectionNotFoundError";
import {IndexCreator} from "../index-creator/IndexCreator";

/**
 * Connection manager holds all connections made to the databases.
 */
export class ConnectionManager {

    // todo: add support for importing documents and subscribers from subdirectories, make support of glob patterns

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private connections: Connection[] = [];
    private schemaBuilder: SchemaBuilder;
    private metadataAggregator: MetadataAggregationBuilder;
    private _container: { get(someClass: any): any };

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(schemaBuilder?: SchemaBuilder, metadataAggregator?: MetadataAggregationBuilder) {
        if (!schemaBuilder)
            schemaBuilder = new SchemaBuilder(new DefaultNamingStrategy());
        if (!metadataAggregator)
            metadataAggregator = new MetadataAggregationBuilder(defaultMetadataStorage);

        this.schemaBuilder = schemaBuilder;
        this.metadataAggregator = metadataAggregator;
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    /**
     * Sets a container that can be used in your custom subscribers. This allows you to inject services in your
     * classes.
     */
    set container(container: { get(someClass: any): any }) {
        this._container = container;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Creates and adds a new connection with given driver.
     */
    addConnection(driver: Driver): void;
    addConnection(name: string, driver: Driver): void;
    addConnection(name: any, driver?: Driver): void {
        if (typeof name === "object") {
            driver = <Driver> name;
            name = "default";
        }
        this.connections.push(new Connection(name, driver));
    }

    /**
     * Gets the specific connection.
     */
    getConnection(name: string = "default"): Connection {
        let foundConnection = this.connections.reduce((found, connection) => connection.name === name ? connection : found, null);
        if (!foundConnection)
            throw new ConnectionNotFoundError(name);

        return foundConnection;
    }

    /**
     * Imports documents to the given connection.
     */
    importDocuments(documents: Function[]): void;
    importDocuments(connectionName: string, documents: Function[]): void;
    importDocuments(connectionNameOrDocuments: string|Function[], documents?: Function[]): void {
        let connectionName = "default";
        if (typeof connectionNameOrDocuments === "string") {
            connectionName = <string> connectionNameOrDocuments;
        } else {
            documents = <Function[]> connectionNameOrDocuments;
        }

        let schemas = this.schemaBuilder.build(this.metadataAggregator.build(documents));
        if (schemas.length > 0)
            this.getConnection(connectionName).addSchemas(schemas);
    }

    /**
     * Imports documents from the given paths.
     */
    importDocumentsFromDirectories(paths: string[]): void;
    importDocumentsFromDirectories(connectionName: string, paths: string[]): void;
    importDocumentsFromDirectories(connectionNameOrPaths: string|string[], paths?: string[]): void {
        let connectionName = "default";
        if (typeof connectionNameOrPaths === "string") {
            connectionName = <string> connectionNameOrPaths;
        } else {
            paths = <string[]> connectionNameOrPaths;
        }

        let documentsInFiles = OdmUtils.requireAll(paths);
        let allDocuments = documentsInFiles.reduce((allDocuments, documents) => {
            return allDocuments.concat(Object.keys(documents).map(key => documents[key]));
        }, []);
        
        this.importDocuments(connectionName, allDocuments);
    }

    /**
     * Imports subscribers from the given paths.
     */
    importSubscribersFromDirectories(paths: string[]): void;
    importSubscribersFromDirectories(connectionName: string, paths: string[]): void;
    importSubscribersFromDirectories(connectionName: any, paths?: string[]): void {
        if (typeof connectionName === "object") {
            paths = connectionName;
            connectionName = "default";
        }

        let subscribersInFiles = OdmUtils.requireAll(paths);
        let allSubscriberClasses = subscribersInFiles.reduce((all, subscriberInFile) => {
            return all.concat(Object.keys(subscriberInFile).map(key => subscriberInFile[key]));
        }, []);

        let subscribers = defaultMetadataStorage.odmEventSubscriberMetadatas
                                        .filter(metadata => allSubscriberClasses.indexOf(metadata.constructor) !== -1)
                                        .map(metadata => {
            let constructor: any = metadata.constructor;
            return this._container ? this._container.get(constructor) : new constructor();
        });
        if (subscribers.length > 0)
            this.getConnection(connectionName).addSubscribers(subscribers);
    }

}
