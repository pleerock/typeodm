import {DocumentSchema} from "../../schema/DocumentSchema";
import {Connection} from "../../connection/Connection";

export class DocumentInitializer<Document> {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private connection: Connection;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(connection: Connection) {
        this.connection = connection;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    initialize(object: any, schema: DocumentSchema, fetchProperty?: boolean): Promise<Document>;
    initialize(object: any, schema: DocumentSchema, fetchProperty?: Object): Promise<Document>;
    initialize(object: any, schema: DocumentSchema, fetchOption?: boolean|Object/*, fetchCascadeOptions?: any*/): Promise<Document> {
        return this.objectToDocument(object, schema, fetchOption);
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private objectToDocument(object: any, schema: DocumentSchema, doFetchProperties?: boolean): Promise<any>;
    private objectToDocument(object: any, schema: DocumentSchema, fetchConditions?: Object): Promise<any>;
    private objectToDocument(object: any, schema: DocumentSchema, fetchOption?: boolean|Object): Promise<any> {
        if (!object)
            throw new Error("Given object is empty, cannot initialize empty object.");

        let doFetch = !!fetchOption;
        let repository = this.connection.getRepository(schema.documentClass);
        let documentPromise: Promise<any>, documentId: string, documentConditions: Object;

        if (doFetch && fetchOption instanceof Object) {
            documentConditions = <Object> fetchOption;
            documentPromise = repository.findOne(documentConditions);
        } else if (doFetch && repository.hasId(object)) {
            documentId = object[schema.idField.name];
            documentPromise = repository.findById(documentId);
        } else {
            documentPromise = Promise.resolve(schema.create());
        }

        // todo: this needs strong optimization. since repository.findById makes here multiple operations and each time loads lot of data by cascades

        return documentPromise.then((document: any) => {

            if (!document)
                document = schema.create();
            // if (!document && documentId)
                // throw new Error('Document ' + schema.name + ' with given id ' + documentId + ' was not found');
            // if (!document && documentConditions)
                // throw new Error('Document ' + schema.name + ' with given conditions ' + JSON.stringify(documentConditions) + ' was not found');

            return Promise.all(Object.keys(object)
                .filter(key => schema.hasFieldOrRelationWithPropertyName(key))
                .reduce((promises, key) => {
                    let subSchemaType = schema.getFunctionTypeForFieldOrRelationWithPropertyName(key);
                    let subSchema = subSchemaType ? this.connection.getSchema(subSchemaType) : undefined;

                    if (object[key] instanceof Array && subSchema) {
                        promises.push(
                            Promise.all(object[key].map((i: any) => this.objectToDocument(i, subSchema, doFetch)))
                                .then(subDocuments => document[key] = subDocuments)
                        );

                    } else if (object[key] instanceof Object && subSchema) {
                        promises.push(this.objectToDocument(object[key], subSchema, doFetch).then(subDocument => document[key] = subDocument));

                    } else {
                        document[key] = object[key];
                    }

                    return promises;
                }, [])).then(_ => document);
        });
    }

}