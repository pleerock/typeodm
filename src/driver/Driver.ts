import {ConnectionOptions} from "../connection/ConnectionOptions";
import {FindOptions} from "../driver/options/FindOptions";
import {InsertOptions} from "../driver/options/InsertOptions";
import {AggergationOptions} from "../driver/options/AggergationOptions";
import {CountOptions} from "../driver/options/CountOptions";
import {DeleteOptions} from "../driver/options/DeleteOptions";
import {DistinctOptions} from "../driver/options/DistinctOptions";
import {FindOneAndDeleteOptions} from "../driver/options/FindOneAndDeleteOptions";
import {FindOneAndReplaceOptions} from "../driver/options/FindOneAndReplaceOptions";
import {FindOneAndUpdateOptions} from "../driver/options/FindOneAndUpdateOptions";
import {GeoHaystackSearchOptions} from "../driver/options/GeoHaystackSearchOptions";
import {GeoNearOptions} from "../driver/options/GeoNearOptions";
import {GroupOptions} from "../driver/options/GroupOptions";
import {MapReduceOptions} from "mongodb";
import {ReplaceOptions} from "../driver/options/ReplaceOptions";
import {UpdateOptions} from "../driver/options/UpdateOptions";
import {BulkOperationOptions} from "./options/OrderedBulkOperationOptions";
import {BulkWriteResult} from "./results/BulkWriteResult";
import {InsertOneResult} from "./results/InsertOneResult";
import {InsertResult} from "./results/InsertResult";
import {UpdateResult} from "./results/UpdateResult";
import {DeleteResult} from "./results/DeleteResult";
import {BulkWriteOptions} from "./options/BulkWriteOptions";
import {BulkWriteOperations} from "./operations/BulkWriteOperations";

/**
 * Driver communicates with specific database.
 */
export interface Driver {

    /**
     * Access to the native implementation of the database.
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
     * Creates a object id from the given id string.
     * @deprecated use this method from utils
     */
    createObjectId(id: any, isObjectId: boolean): any;

    /**
     * Creates condition that can be used to query something by id.
     */
    createIdCondition(id: any, isObjectId: boolean): any;

    /**
     * Checks if given thing is object id or not.
     * @deprecated use this method from utils
     */
    isObjectId(id: any): boolean;

    /**
     * Gets the id field name in the document reserved by database (like "_id").
     */
    getIdFieldName(): string;

    /**
     * Finds the documents in the given collection by the given conditions.
     */
    find(collection: string, query: Object, options?: FindOptions): Promise<Object[]>;

    /**
     * Finds one document in the given collection by the given conditions.
     */
    findOne(collection: string, query: Object, options?: FindOptions): Promise<Object>;

    /**
     * Finds one document by a given document id.
     */
    findOneById(collection: string, id: string, isObjectId: boolean, options?: Object): Promise<Object>;

    /**
     * Runs a multiple aggregated stages function in the given collection.
     */
    aggregate(collection: string, stages: any[]): Promise<any>;

    /**
     * Drops the database.
     */
    dropDatabase(): Promise<void>;

    /**
     * Drops the given collection.
     */
    drop(collection: string): Promise<boolean>;

    /**
     * Checks the given collection for existence.
     */
    isExist(collection: string): Promise<boolean>;

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

    /**
     * Gives number of rows found by a given criteria.
     */
    count(collection: string, criteria: any, options?: CountOptions): Promise<number>;

    /**
     * Runs aggregation steps and returns its result. Note that result is raw mongodb objects, so you must
     * process it by yourself to fit this data to your models.
     *
     * @param stages Array containing all the aggregation framework commands for the execution.
     * @param options Optional settings.
     */
    aggregate(collection: string, stages: any[], options?: AggergationOptions): Promise<any>;

    /**
     * Inserts a single document into MongoDB.
     *
     * @param document Document to insert.
     * @param options Optional settings.
     */
    insertOne(collection: string, document: any, options?: InsertOptions): Promise<InsertOneResult>;

    /**
     * Inserts an array of documents into MongoDB.
     *
     * @param documents Documents to insert.
     * @param options Optional settings.
     */
    insertMany(collection: string, documents: any[], options?: InsertOptions): Promise<InsertResult>;

    /**
     * Update a single document on MongoDB
     *
     * @param query The Filter used to select the document to update
     * @param update The update operations to be applied to the document
     * @param options Optional settings.
     */
    updateOne(collection: string, query: Object, update: Object, options?: UpdateOptions): Promise<UpdateResult>;

    /**
     * Update multiple documents on MongoDB
     *
     * @param query The Filter used to select the document to update
     * @param update The update operations to be applied to the document
     * @param options Optional settings.
     */
    updateMany(collection: string, query: Object, update: Object, options?: UpdateOptions): Promise<UpdateResult>;

    /**
     * Replace a document on MongoDB.
     *
     * @param query The Filter used to select the document to update
     * @param document The Document that replaces the matching document
     * @param options Optional settings.
     */
    replaceOne(collection: string, query: Object, document: any, options?: ReplaceOptions): Promise<UpdateResult>;

    /**
     * Delete a document on MongoDB.
     *
     * @param query The Filter used to select the document to remove
     * @param options Optional settings.
     */
    deleteOne(collection: string, query: Object, options?: DeleteOptions): Promise<DeleteResult>;

    /**
     * Delete multiple documents on MongoDB.
     *
     * @param query The Filter used to select the documents to remove
     * @param options
     */
    deleteMany(collection: string, query: Object, options?: DeleteOptions): Promise<DeleteResult>;

    /**
     * Removes document of the given document id.
     *
     * @param id Id of the document to be removed
     * @param options
     */
    deleteOneById(collection: string, id: any, isObjectId: boolean, options?: DeleteOptions): Promise<DeleteResult>;

    /**
     * The distinct command returns returns a list of distinct values for the given key across a collection.
     *
     * @param key Field of the document to find distinct values for.
     * @param query The query for filtering the set of documents to which we apply the distinct filter.
     * @param options
     */
    distinct(collection: string, key: string, query: Object, options?: DistinctOptions): Promise<any[]>;

    /**
     * Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param query Document selection filter.
     * @param options Optional settings.
     */
    findOneAndDelete(collection: string, query: Object, options?: FindOneAndDeleteOptions): Promise<Object>;

    /**
     * Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param query Document selection filter.
     * @param replacement Document replacing the matching document.
     * @param options Optional settings.
     */
    findOneAndReplace(collection: string, query: Object, replacement: Object, options?: FindOneAndReplaceOptions): Promise<Object>;

    /**
     * Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param query Document selection filter.
     * @param update Update operations to be performed on the document
     * @param options Optional settings.
     */
    findOneAndUpdate(collection: string, query: Object, update: Object, options?: FindOneAndUpdateOptions): Promise<Object>;

    /**
     * Execute a geo search using a geo haystack index on a collection.
     *
     * @param x Point to search on the x axis, ensure the indexes are ordered in the same order.
     * @param y Point to search on the y axis, ensure the indexes are ordered in the same order.
     * @param options Optional settings.
     */
    geoHaystackSearch(collection: string, x: number, y: number, options?: GeoHaystackSearchOptions): Promise<Object[]>;

    /**
     * Execute the geoNear command to search for items in the collection.
     *
     * @param x Point to search on the x axis, ensure the indexes are ordered in the same order.
     * @param y Point to search on the y axis, ensure the indexes are ordered in the same order.
     * @param options Optional settings.
     */
    geoNear(collection: string, x: number, y: number, options?: GeoNearOptions): Promise<Object[]>;

    /**
     * Run a group command across a collection.
     *
     * @param keys An object, array or function expressing the keys to group by.
     * @param condition An optional condition that must be true for a row to be considered.
     * @param initial Initial value of the aggregation counter object.
     * @param reduce The reduce function aggregates (reduces) the objects iterated
     * @param finalize An optional function to be run on each item in the result set just before the item is returned.
     * @param command Specify if you wish to run using the internal group command or using eval, default is true.
     * @param options Optional settings.
     */
    group(collection: string, keys: Object, condition: Object, initial: Object, reduce: Function, finalize: Function, command: boolean, options?: GroupOptions): Promise<any>;

    /**
     * Initiate an In order bulk write operation .
     *
     * @param operations Function where all operations are being runned
     * @param options Optional settings.
     * @deprecated
     */
    executeOrderedOperations(collection: string, operations: Function, options?: BulkOperationOptions): Promise<BulkWriteResult>;

    /**
     * Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove
     * commands executed out of order.
     *
     * @param operations Function where all operations are being runned
     * @param options Optional settings.
     * @deprecated
     */
    executeUnorderedOperations(collection: string, operations: Function, options?: BulkOperationOptions): Promise<BulkWriteResult>;

    /**
     * Perform a bulkWrite operation without a fluent API
     *
     * @param collection Collection name.
     * @param operations Bulk operations to perform.
     * @param options Optional settings.
     */
    bulkWrite(collection: string, operations: BulkWriteOperations, options?: BulkWriteOptions): Promise<BulkWriteResult>;

    /**
     * Run Map Reduce across a collection.
     *
     * @param map The mapping function.
     * @param reduce The reduce function.
     * @param options Optional settings.
     */
    mapReduce(collection: string, map: Function, reduce: Function, options?: MapReduceOptions): Promise<any>;

}