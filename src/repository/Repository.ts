import {DocumentSchema} from "../schema/DocumentSchema";
import {Driver} from "../driver/Driver";
import {Connection} from "../connection/Connection";
import {DocumentPersister} from "./persistence/DocumentPersister";
import {DocumentHydrator} from "./hydration/DocumentHydrator";
import {JoinFieldOption} from "./hydration/JoinFieldOption";
import {OdmBroadcaster} from "../subscriber/OdmBroadcaster";
import {DocumentRemover} from "./removement/DocumentRemover";
import {CascadeOption, DynamicCascadeOptions} from "./cascade/CascadeOption";
import {BadDocumentInstanceException} from "./exception/BadDocumentInstanceException";
import {CascadeOptionUtils} from "./cascade/CascadeOptionUtils";
import {FieldSchema} from "../schema/FieldSchema";
import {RelationSchema} from "../schema/RelationSchema";
import {DocumentInitializer} from "./initializer/DocumentInitializer";
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
import {BulkOperationOptions} from "../driver/options/OrderedBulkOperationOptions";

/**
 * Repository is supposed to work with your document objects. Find documents, insert, update, delete, etc.
 */
export class Repository<Document> {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _connection: Connection;
    private _schema: DocumentSchema;
    private broadcaster: OdmBroadcaster<Document>;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(connection: Connection, schema: DocumentSchema, broadcaster: OdmBroadcaster<Document>) {
        this._connection    = connection;
        this._schema        = schema;
        this.broadcaster    = broadcaster;
    }

    // -------------------------------------------------------------------------
    // Getter Methods
    // -------------------------------------------------------------------------

    get schema(): DocumentSchema {
        return this._schema;
    }

    get connection(): Connection {
        return this._connection;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Creates a new document.
     */
    create(): Document {
        return <Document> this.schema.create();
    }

    /**
     * Checks if document has id.
     */
    hasId(document: Document): boolean {
        return document && document.hasOwnProperty(this.schema.idField.name);
    }

    /**
     * Creates a document from the given json data. If fetchAllData param is specified then document data will be
     * loaded from the database first, then filled with given json data.
     */
    initialize(json: any, fetchProperty?: boolean): Promise<Document>;
    initialize(json: any, fetchProperty?: Object): Promise<Document>;
    initialize(json: any, fetchOption?: boolean|Object/*, fetchCascadeOptions?: any*/): Promise<Document> {
        let initializer = new DocumentInitializer<Document>(this.connection);
        return initializer.initialize(json, this.schema, fetchOption);
    }

    /**
     * Finds a documents that match given conditions.
     */
    find(conditions?: Object, options?: FindOptions, joinedFieldsCallback?: (document: Document) => JoinFieldOption[]|any[]): Promise<Document[]> {
        let joinFields = joinedFieldsCallback ? joinedFieldsCallback(this.schema.createPropertiesMirror()) : [];
        return this.connection.driver
            .find(this.schema.name, conditions, options)
            .then(objects => objects ? Promise.all(objects.map(object => this.dbObjectToDocument(object, joinFields))) : [])
            .then(documents => {
                if (documents.length > 0)
                    this.broadcaster.broadcastAfterLoadedAll(documents);
                return documents;
            });
    }

    /**
     * Finds one document that matches given condition.
     */
    findOne(conditions: Object, options?: FindOptions, joinedFieldsCallback?: (document: Document) => JoinFieldOption[]|any[]): Promise<Document> {
        let joinFields = joinedFieldsCallback ? joinedFieldsCallback(this.schema.createPropertiesMirror()) : [];
        return this.connection.driver
            .findOne(this.schema.name, conditions, options)
            .then(i => i ? this.dbObjectToDocument(i, joinFields) : null)
            .then(document => {
                if (document) this.broadcaster.broadcastAfterLoaded(document);
                return document;
            });
    }

    /**
     * Finds a document with given id.
     */
    findById(id: string, options?: FindOptions, joinedFieldsCallback?: (document: Document) => JoinFieldOption[]|any[]): Promise<Document> {
        let joinFields = joinedFieldsCallback ? joinedFieldsCallback(this.schema.createPropertiesMirror()) : [];
        return this.connection.driver.findOne(this.schema.name, this.createIdObject(id), options)
            .then(i => i ? this.dbObjectToDocument(i, joinFields) : null)
            .then(document => {
                if (document) this.broadcaster.broadcastAfterLoaded(document);
                return document;
            });
    }

    /**
     * Saves a given document. If document is not inserted yet then it inserts a new document.
     * If document already inserted then performs its update.
     */
    persist(document: Document, dynamicCascadeOptions?: DynamicCascadeOptions<Document>): Promise<Document> {
        //if (!this.schema.isDocumentTypeCorrect(document))
        //    throw new BadDocumentInstanceException(document, this.schema.documentClass);

        let remover     = new DocumentRemover<Document>(this.connection);
        let persister   = new DocumentPersister<Document>(this.connection);

        return remover.computeRemovedRelations(this.schema, document, dynamicCascadeOptions)
            .then(result => persister.persist(this.schema, document, dynamicCascadeOptions))
            .then(result => remover.executeRemoveOperations())
            .then(result => remover.executeUpdateInverseSideRelationRemoveIds())
            .then(result => document);
    }

    /**
     * Removes a given document.
     */
    remove(document: Document, dynamicCascadeOptions?: DynamicCascadeOptions<Document>): Promise<void> {
        //if (!this.schema.isDocumentTypeCorrect(document))
        //    throw new BadDocumentInstanceException(document, this.schema.documentClass);

        let remover = new DocumentRemover<Document>(this.connection);
        return remover.registerDocumentRemoveOperation(this.schema, this.schema.getDocumentId(document), dynamicCascadeOptions)
            .then(results => remover.executeRemoveOperations())
            .then(results => remover.executeUpdateInverseSideRelationRemoveIds());
    }

    /**
     * Updates a document with given id by applying given update options.
     */
    updateById(id: string, updateOptions?: Object): Promise<void> {
        let selectConditions = this.createIdObject(id);
        this.broadcaster.broadcastBeforeUpdate({ conditions: selectConditions, options: updateOptions });

        return this.connection.driver
            .updateOne(this.schema.name, selectConditions, updateOptions)
            .then(result => {
                this.broadcaster.broadcastAfterUpdate({ conditions: selectConditions, options: updateOptions });
            });
    }

    /**
     * Updates a document found by applying given update options.
     */
    updateByConditions(conditions: Object, updateOptions?: Object): Promise<void> {
        this.broadcaster.broadcastBeforeUpdate({ conditions: conditions, options: updateOptions });
        return this.connection.driver
            .updateOne(this.schema.name, conditions, updateOptions)
            .then(document => {
                this.broadcaster.broadcastAfterUpdate({ conditions: conditions, options: updateOptions });
            });
    }

    /**
     * Removes document by a given id.
     */
    removeById(id: string): Promise<void> {
        let conditions = this.createIdObject(id);
        this.broadcaster.broadcastBeforeRemove({ documentId: id, conditions: conditions });
        return this.connection.driver
            .deleteOne(this.schema.name, conditions)
            .then(result => {
                this.broadcaster.broadcastAfterRemove({ documentId: id, conditions: conditions });
            });
    }

    /**
     * Removes documents by a given conditions.
     */
    removeByConditions(conditions: Object): Promise<any> {
        this.broadcaster.broadcastBeforeRemove({ conditions: conditions });
        return this.connection.driver.deleteOne(this.schema.name, conditions)
            .then(document => {
                this.broadcaster.broadcastAfterRemove({ conditions: conditions });
                return document;
            });
    }

    /**
     * Finds documents by given criteria and returns them with the total number of
     */
    findAndCount(criteria?: any, findOptions?: FindOptions, countOptions?: CountOptions): Promise<{ documents: Document[], count: number }> {
        let documents: Document[];
        return this.find(criteria, findOptions).then(loadedDocuments => {
            documents = loadedDocuments;
            return this.count(criteria, countOptions);

        }).then(count => {
            return {
                documents: documents,
                count: count
            };
        });
    }

    /**
     * Gives number of rows found by a given criteria.
     */
    count(criteria: any, options?: CountOptions): Promise<number> {
        return this.connection.driver.count(this.schema.name, criteria, options);
    }

    /**
     * Runs aggregation steps and returns its result. Note that result is raw mongodb objects, so you must
     * process it by yourself to fit this data to your models.
     *
     * @param stages Array containing all the aggregation framework commands for the execution.
     * @param options Optional settings.
     */
    aggregate(stages: any[], options?: AggergationOptions): Promise<any> {
        return this.connection.driver.aggregate(this.schema.name, stages);
    }

    /**
     * Runs aggregation steps and returns its result. This method supposes that documents will be returned at the
     * end of aggregation operation.
     *
     * @param stages Array containing all the aggregation framework commands for the execution.
     * @param options Optional settings.
     */
    aggregateDocuments(stages: any[], options?: AggergationOptions): Promise<Document[]> {
        return this.connection.driver.aggregate(this.schema.name, stages)
            .then((objects: any[]) => Promise.all(objects.map(object => this.dbObjectToDocument(object))));
    }

    /**
     * Inserts a single document into MongoDB.
     *
     * @param document Document to insert.
     * @param options Optional settings.
     */
    insertOne(document: Document, options?: InsertOptions): Promise<void> {
        return this.connection.driver
            .insertOne(this.schema.name, document, options)
            .then(result => {
                if (result.insertedId)
                    (<any>document)[this.schema.idField.name] = String(result.insertedId);
            });
    }

    /**
     * Inserts an array of documents into MongoDB.
     *
     * @param documents Documents to insert.
     * @param options Optional settings.
     */
    insertMany(documents: Document[], options?: InsertOptions): Promise<void> {
        return this.connection.driver
            .insertMany(this.schema.name, documents, options)
            .then(result => result.insertedIds.forEach((id, index) => {
                (<any>documents[index])[this.schema.idField.name] = String(id);
            }));
    }

    /**
     * Update a single document on MongoDB
     *
     * @param query The Filter used to select the document to update
     * @param update The update operations to be applied to the document
     * @param options Optional settings.
     */
    updateOne(query: Object, update: Object, options?: UpdateOptions): Promise<void> {
        return this.connection.driver
            .updateOne(this.schema.name, query, update, options)
            .then(() => {});
    }

    /**
     * Update multiple documents on MongoDB
     *
     * @param query The Filter used to select the document to update
     * @param update The update operations to be applied to the document
     * @param options Optional settings.
     */
    updateMany(query: Object, update: Object, options?: UpdateOptions): Promise<void> {
        return this.connection.driver
            .updateMany(this.schema.name, query, update, options)
            .then(() => {});
    }

    /**
     * Replace a document on MongoDB.
     *
     * @param query The Filter used to select the document to update
     * @param document The Document that replaces the matching document
     * @param options Optional settings.
     */
    replaceOne(query: Object, document: Document, options?: ReplaceOptions): Promise<void> {
        return this.connection.driver
            .replaceOne(this.schema.name, query, document, options)
            .then(() => {});
    }

    /**
     * Delete a document on MongoDB.
     *
     * @param query The Filter used to select the document to remove
     * @param options Optional settings.
     */
    deleteOne(query: Object, options?: DeleteOptions): Promise<void> {
        return this.connection.driver
            .deleteOne(this.schema.name, query, options)
            .then(() => {});
    }

    /**
     * Delete multiple documents on MongoDB.
     *
     * @param query The Filter used to select the documents to remove
     * @param options
     */
    deleteMany(query: Object, options?: DeleteOptions): Promise<void> {
        return this.connection.driver
            .deleteMany(this.schema.name, query, options)
            .then(() => {});
    }

    /**
     * The distinct command returns returns a list of distinct values for the given key across a collection.
     *
     * @param key Field of the document to find distinct values for.
     * @param query The query for filtering the set of documents to which we apply the distinct filter.
     * @param options
     */
    distinct(key: string, query: Object, options?: DistinctOptions): Promise<any[]> {
        return this.connection.driver.distinct(this.schema.name, key, query, options);
    }

    /**
     * Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param query Document selection filter.
     * @param options Optional settings.
     */
    findOneAndDelete(query: Object, options?: FindOneAndDeleteOptions): Promise<Document> {
        return this.connection.driver.findOneAndDelete(this.schema.name, query, options);
    }

    /**
     * Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param query Document selection filter.
     * @param replacement Document replacing the matching document.
     * @param options Optional settings.
     */
    findOneAndReplace(query: Object, replacement: Object, options?: FindOneAndReplaceOptions): Promise<Document> {
        return this.connection.driver.findOneAndReplace(this.schema.name, query, replacement, options);
    }

    /**
     * Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param query Document selection filter.
     * @param update Update operations to be performed on the document
     * @param options Optional settings.
     */
    findOneAndUpdate(query: Object, update: Object, options?: FindOneAndUpdateOptions): Promise<Document> {
        return this.connection.driver.findOneAndReplace(this.schema.name, query, update, options);
    }

    /**
     * Execute a geo search using a geo haystack index on a collection.
     *
     * @param x Point to search on the x axis, ensure the indexes are ordered in the same order.
     * @param y Point to search on the y axis, ensure the indexes are ordered in the same order.
     * @param options Optional settings.
     */
    geoHaystackSearch(x: number, y: number, options?: GeoHaystackSearchOptions): Promise<Document[]> {
        return this.connection.driver.geoHaystackSearch(this.schema.name, x, y, options);
    }

    /**
     * Execute the geoNear command to search for items in the collection.
     *
     * @param x Point to search on the x axis, ensure the indexes are ordered in the same order.
     * @param y Point to search on the y axis, ensure the indexes are ordered in the same order.
     * @param options Optional settings.
     */
    geoNear(x: number, y: number, options?: GeoNearOptions): Promise<Document[]> {
        return this.connection.driver.geoHaystackSearch(this.schema.name, x, y, options);
    }

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
    group(keys: Object, condition: Object, initial: Object, reduce: Function, finalize: Function, command: boolean, options?: GroupOptions): Promise<any> {
        return this.connection.driver.group(this.schema.name, keys, condition, initial, reduce, finalize, command, options);
    }

    /**
     * Initiate an In order bulk write operation .
     *
     * @param operations Function where all operations are being runned
     * @param options Optional settings.
     */
    executeOrderedOperations(operations: Function, options?: BulkOperationOptions): Promise<void> {
        return this.connection.driver
            .executeOrderedOperations(this.schema.name, operations, options)
            .then(() => {});
    }

    /**
     * Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove
     * commands executed out of order.
     *
     * @param operations Function where all operations are being runned
     * @param options Optional settings.
     */
    executeUnorderedOperations(operations: Function, options?: BulkOperationOptions): Promise<void> {
        return this.connection.driver
            .executeUnorderedOperations(this.schema.name, operations, options)
            .then(() => {});
    }

    /**
     * Run Map Reduce across a collection.
     *
     * @param map The mapping function.
     * @param reduce The reduce function.
     * @param options Optional settings.
     */
    mapReduce(map: Function, reduce: Function, options?: MapReduceOptions): Promise<any> {
        return this.connection.driver.mapReduce(this.schema.name, map, reduce, options);
    }

    /**
     * Run Map Reduce across a collection. The resulted value must be document objects.
     *
     * @param map The mapping function.
     * @param reduce The reduce function.
     * @param options Optional settings.
     */
    mapReduceDocument(map: Function, reduce: Function, options?: MapReduceOptions): Promise<Document[]> {
        return this.connection.driver
            .mapReduce(this.schema.name, map, reduce, options)
            .then(results => results && results.length ? results.map((i: any) => this.dbObjectToDocument(i)) : null);
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private createIdObject(id: string): Object {
        return { [this.connection.driver.getIdFieldName()]: this.connection.driver.createObjectId(id) };
    }

    private dbObjectToDocument(dbObject: any, joinFields?: JoinFieldOption[]|any[]): Promise<Document> {
        let hydrator = new DocumentHydrator<Document>(this.connection);
        return hydrator.hydrate(this.schema, dbObject, joinFields);
    }


}