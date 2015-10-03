import {ConnectionOptions} from "../connection/ConnectionOptions";

/**
 * Driver communicates with specific database.
 */
export interface Driver {

    /**
     * Access to the native implementation of the driver.
     */
    native: any;

    /**
     * Connects to the database.
     */
    connect(options: ConnectionOptions): Promise<any>;

    /**
     * Closes connection to the database.
     */
    closeConnection(): Promise<any>;

    /**
     * Inserts a new document to the given collection.
     */
    insert(collection: string, document: any): Promise<any>;

    /**
     * Bulk insertion of the documents to the given collection.
     */
    bulkInsert(collection: string, documents: any[]): Promise<any[]>;

    /**
     * Updates documents of the given collection by the given conditions and options.
     */
    update(collection: string, conditions: Object, updateOptions?: Object): Promise<any>;

    /**
     * Replaces documents of the given collection by the given conditions and options. todo
     */
    replace(collection: string, conditions: Object, updateOptions?: Object): Promise<any>;

    /**
     * Removes documents of the given collection by the given conditions and options.
     */
    remove(collection: string, conditions: Object): Promise<any>;

    /**
     * Removes document of the given document id.
     */
    removeById(collection: string, id: string): Promise<any>;

    /**
     * Finds the documents in the given collection by the given conditions.
     */
    find(collection: string, conditions: Object): Promise<any[]>;

    /**
     * Finds one document in the given collection by the given conditions.
     */
    findOne(collection: string, conditions: Object): Promise<any>;

    /**
     * Finds one document by a given document id.
     */
    findById(collection: string, id: string): Promise<any>;

    /**
     * Runs a multiple aggregated stages function in the given collection.
     */
    aggregate(collection: string, stages: any[]): Promise<any>;

    /**
     * Creates a object id from the given id string. todo: check if we really allow types for ids
     */
    createObjectId(id?: string): any;

    /**
     * Checks if given thing is object id or not.
     */
    isObjectId(id: any): boolean;

    /**
     * Gets the id field name in the document reserved by database (like "_id").
     */
    getIdFieldName(): string;

    /**
     * Drops the give collection if its given, or drops all collections if collection is not given.
     */
    drop(collection?: string): Promise<void>;

    /**
     * Sets relation of the given document in a given collection with specific related value.
     */
    setOneRelation(collection: string, documentId: any, relationPropertyName: string, relationPropertyValue: any): Promise<void>;

    /**
     * Sets relation of the given document in a given collection with specific related value.
     */
    setManyRelation(collection: string, documentId: any, relationPropertyName: string, relationPropertyValue: any): Promise<void>;

    /**
     * Unsets relation of the given document in a given collection with specific related value.
     */
    unsetOneRelation(collection: string, documentId: any, relationPropertyName: string, relationPropertyValue: any): Promise<void>;

    /**
     * Unsets relation of the given document in a given collection with specific related value.
     */
    unsetManyRelation(collection: string, documentId: any, relationPropertyName: string, relationPropertyValue: any): Promise<void>;

    /**
     * Creates index with given options for the given collection.
     */
    createIndex(collection: string, keys: any, options: any): Promise<void>;

}