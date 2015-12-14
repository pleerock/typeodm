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
        if (typeof name === 'object') {
            driver = <Driver> name;
            name = 'default';
        }
        this.connections.push(new Connection(name, driver));
    }

    /**
     * Gets the specific connection.
     */
    getConnection(name: string = 'default'): Connection {
        let foundConnection = this.connections.reduce((found, connection) => connection.name === name ? connection : found, null);
        if (!foundConnection)
            throw new ConnectionNotFoundError(name);

        return foundConnection;
    }

    /**
     * Imports documents from the given paths.
     */
    importDocumentsFromDirectories(pathes: string[]): void;
    importDocumentsFromDirectories(connectionName: string, pathes: string[]): void;
    importDocumentsFromDirectories(connectionName: any, pathes?: string[]): void {
        if (typeof connectionName === 'object') {
            pathes = connectionName;
            connectionName = 'default';
        }

        let documentsInFiles = OdmUtils.requireAll(pathes);
        let allDocuments = documentsInFiles.reduce((allDocuments, documents) => {
            return allDocuments.concat(Object.keys(documents).map(key => documents[key]));
        }, []);

        let schemas = this.schemaBuilder.build(this.metadataAggregator.build(allDocuments));
        if (schemas.length > 0)
            this.getConnection(connectionName).addSchemas(schemas);
    }

    /**
     * Imports subscribers from the given paths.
     */
    importSubscribersFromDirectories(pathes: string[]): void;
    importSubscribersFromDirectories(connectionName: string, pathes: string[]): void;
    importSubscribersFromDirectories(connectionName: any, pathes?: string[]): void{
        if (typeof connectionName === 'object') {
            pathes = connectionName;
            connectionName = 'default';
        }

        let subscribersInFiles = OdmUtils.requireAll(pathes);
        let allSubscriberClasses = subscribersInFiles.reduce((all, subscriberInFile) => {
            return all.concat(Object.keys(subscriberInFile).map(key => subscriberInFile[key]));
        }, []);

        let subscribers = defaultMetadataStorage.odmEventSubscriberMetadatas
                                        .filter(metadata => allSubscriberClasses.indexOf(metadata.constructor) !== -1)
                                        .map(metadata => {
            let constructor: any = metadata.constructor;
            return this._container ? this._container.get(constructor) : new constructor()
        });
        if (subscribers.length > 0)
            this.getConnection(connectionName).addSubscribers(subscribers);
    }

}
