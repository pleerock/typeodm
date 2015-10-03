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
     * Finds a documents that match given conditions.
     */
    find(conditions?: Object, joinedFieldsCallback?: (document: Document) => JoinFieldOption[]|any[]): Promise<Document[]> {
        let joinFields = joinedFieldsCallback ? joinedFieldsCallback(this.schema.createPropertiesMirror()) : [];
        return this.connection.driver.find(this.schema.name, conditions)
            .then(objects => objects ? Promise.all(objects.map(object => this.dbObjectToDocument(object, joinFields))) : objects)
            .then(documents => {
                this.broadcaster.broadcastAfterLoadedAll(documents);
                return documents;
            });
    }

    /**
     * Finds one document that matches given condition.
     */
    findOne(conditions: Object, joinedFieldsCallback?: (document: Document) => JoinFieldOption[]|any[]): Promise<Document> {
        let joinFields = joinedFieldsCallback ? joinedFieldsCallback(this.schema.createPropertiesMirror()) : [];
        return this.connection.driver.findOne(this.schema.name, conditions)
            .then(i => i ? this.dbObjectToDocument(i, joinFields) : i)
            .then(document => {
                this.broadcaster.broadcastAfterLoaded(document);
                return document;
            });
    }

    /**
     * Finds a document with given id.
     */
    findById(id: string, joinedFieldsCallback?: (document: Document) => JoinFieldOption[]|any[]): Promise<Document> {
        let joinFields = joinedFieldsCallback ? joinedFieldsCallback(this.schema.createPropertiesMirror()) : [];
        return this.connection.driver.findOne(this.schema.name, this.createIdObject(id))
            .then(i => i ? this.dbObjectToDocument(i, joinFields) : i)
            .then(document => {
                this.broadcaster.broadcastAfterLoaded(document);
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
    updateById(id: string, updateOptions?: Object): Promise<Document> {
        let selectConditions = this.createIdObject(id);
        this.broadcaster.broadcastBeforeUpdate({ conditions: selectConditions, options: updateOptions });

        return this.connection.driver.update(this.schema.name, selectConditions, updateOptions).then(document => {
            this.broadcaster.broadcastAfterUpdate({ document: document, conditions: selectConditions, options: updateOptions });
            return document;
        });
    }

    /**
     * Updates a document found by applying given update options.
     */
    updateByConditions(conditions: Object, updateOptions?: Object): Promise<Document> {
        this.broadcaster.broadcastBeforeUpdate({ conditions: conditions, options: updateOptions });
        return this.connection.driver.update(this.schema.name, conditions, updateOptions).then(document => {
            this.broadcaster.broadcastAfterUpdate({ document: document, conditions: conditions, options: updateOptions });
            return document;
        });
    }

    /**
     * Removes document by a given id.
     */
    removeById(id: string): Promise<any> {
        let conditions = this.createIdObject(id);
        this.broadcaster.broadcastBeforeRemove({ documentId: id, conditions: conditions });
        return this.connection.driver.remove(this.schema.name, conditions)
            .then(result => {
                this.broadcaster.broadcastAfterRemove({ documentId: id, conditions: conditions });
                return document;
            });
    }

    /**
     * Removes documents by a given conditions.
     */
    removeByConditions(conditions: Object): Promise<any> {
        this.broadcaster.broadcastBeforeRemove({ conditions: conditions });
        return this.connection.driver.remove(this.schema.name, conditions)
            .then(document => {
                this.broadcaster.broadcastAfterRemove({ conditions: conditions });
                return document;
            });
    }

    /**
     * Runs aggregation steps and returns its result.
     */
    aggregate(stages: any[]): Promise<any> {
        return this.connection.driver.aggregate(this.schema.name, stages);
    }

    /**
     * Checks if document has id.
     */
    hasId(document: Document): boolean {
        return document && document.hasOwnProperty(this.schema.idField.name);
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