import {Driver} from "../driver/Driver";
import {DocumentSchema} from "../schema/DocumentSchema";
import {ConnectionOptions} from "./ConnectionOptions";
import {Repository} from "../repository/Repository";
import {OdmSubscriber} from "../subscriber/OdmSubscriber";
import {OdmBroadcaster} from "../subscriber/OdmBroadcaster";
import {RepositoryNotFoundError} from "./error/RepositoryNotFoundError";
import {SchemaNotFoundError} from "./error/SchemaNotFoundError";
import {BroadcasterNotFoundError} from "./error/BroadcasterNotFoundError";
import {IndexCreator} from "../index-creator/IndexCreator";

/**
 * A single connection instance to the database. Each connection has its own repositories, subscribers and schemas.
 */
export class Connection {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _name: string;
    private _driver: Driver;
    private _schemas: DocumentSchema[] = [];
    private _subscribers: OdmSubscriber<any>[] = [];
    private _broadcasters: OdmBroadcaster<any>[] = [];
    private _repositories: Repository<any>[] = [];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(name: string, driver: Driver) {
        this._name = name;
        this._driver = driver;
    }

    // -------------------------------------------------------------------------
    // Getter / Setter Methods
    // -------------------------------------------------------------------------

    /**
     * The name of the connection
     */
    get name(): string {
        return this._name;
    }

    /**
     * Database driver used by this connection.
     */
    get driver(): Driver {
        return this._driver;
    }

    /**
     * All subscribers that are registered for this connection.
     */
    get subscribers(): OdmSubscriber<any>[] {
        return this._subscribers;
    }

    /**
     * All broadcasters that are registered for this connection.
     */
    get broadcasters(): OdmBroadcaster<any>[] {
        return this._broadcasters;
    }

    /**
     * All schemas that are registered for this connection.
     */
    get schemas(): DocumentSchema[] {
        return this._schemas;
    }

    /**
     * All repositories that are registered for this connection.
     */
    get repositories(): Repository<any>[] {
        return this._repositories;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Performs connection to the database.
     */
    connect(options: ConnectionOptions): Promise<Connection> {
        const indexCreator = new IndexCreator(this);
        return this._driver.connect(options)
            .then(() => {
                if (options.autoIndex === true)
                    indexCreator.create();

                return this;
            });
    }

    /**
     * Closes this connection.
     */
    close() {
        return this._driver.closeConnection();
    }

    /**
     * Adds a new document schemas.
     */
    addSchemas(schemas: DocumentSchema[]) {
        this._schemas       = this._schemas.concat(schemas);
        this._broadcasters  = this._broadcasters.concat(schemas.map(schema => this.createBroadcasterForSchema(schema)));
        this._repositories  = this._repositories.concat(schemas.map(schema => this.createRepositoryForSchema(schema)));
    }

    /**
     * Adds subscribers to this connection.
     */
    addSubscribers(subscribers: OdmSubscriber<any>[]) {
        this._subscribers = this._subscribers.concat(subscribers);
    }

    /**
     * Gets repository for the given document class.
     */
    getRepository<Document>(documentName: string): Repository<Document>;
    getRepository<Document>(documentClass: Function): Repository<Document>;
    getRepository<Document>(documentClassOrName: Function|string): Repository<Document> {
        let schema = this.getSchema(<Function> documentClassOrName);
        let repository = this.repositories.reduce((found, repository) => repository.schema === schema ? repository : found, null);
        if (!repository)
            throw new RepositoryNotFoundError(documentClassOrName);

        return repository;
    }

    /**
     * Gets the schema for the given document class.
     */
    getSchema(documentClass: Function): DocumentSchema {
        let schema = this.schemas.reduce((found, definition) => definition.documentClass === documentClass ? definition : found, null);
        if (!schema)
            throw new SchemaNotFoundError(documentClass);

        return schema;
    }

    /**
     * Gets the broadcaster for the given document class.
     */
    getBroadcaster<Document>(documentClass: Function): OdmBroadcaster<Document> {
        let schema = this.broadcasters.reduce((found, broadcaster) => broadcaster.documentClass === documentClass ? broadcaster : found, null);
        if (!schema)
            throw new BroadcasterNotFoundError(documentClass);

        return schema;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private createBroadcasterForSchema(schema: DocumentSchema): OdmBroadcaster<any> {
        return new OdmBroadcaster<any>(this.subscribers, schema.documentClass);
    }

    private createRepositoryForSchema(schema: DocumentSchema): Repository<any> {
        return new Repository<any>(this, schema, this.getBroadcaster(schema.documentClass));
    }

}