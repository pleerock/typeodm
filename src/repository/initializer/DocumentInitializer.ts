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

    initialize(object: any, schema: DocumentSchema, fetchAllData: boolean = false/*, fetchCascadeOptions?: any*/): Promise<Document> {
        return this.objectToDocument(object, schema, fetchAllData);
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private objectToDocument(object: any, schema: DocumentSchema, fetchAllData: boolean): Promise<any> {
        let documentId = object[schema.idField.name] ? object[schema.idField.name] : undefined;
        let documentPromise = documentId ? this.connection.getRepository(schema.documentClass).findById(documentId) : Promise.resolve(schema.create());

        // todo: this needs strong optimization. since repository.findById makes here multiple operations and each time loads lot of data by cascades

        return documentPromise.then((document: any) => {
            if (!document && documentId)
                throw new Error('Document ' + schema.name + ' with given id ' + documentId + ' was not found');

            return Promise.all(Object.keys(object)
                .filter(key => schema.hasFieldOrRelationWithPropertyName(key))
                .reduce((promises, key) => {
                    let subSchemaType = schema.getFunctionTypeForFieldOrRelationWithPropertyName(key);
                    let subSchema = subSchemaType ? this.connection.getSchema(subSchemaType) : undefined;

                    if (object[key] instanceof Array && subSchema) {
                        promises.push(
                            Promise.all(object[key].map((i: any) => this.objectToDocument(i, subSchema, fetchAllData)))
                                .then(subDocuments => document[key] = subDocuments)
                        );

                    } else if (object[key] instanceof Object && subSchema) {
                        promises.push(this.objectToDocument(object[key], subSchema, fetchAllData).then(subDocument => document[key] = subDocument));

                    } else {
                        document[key] = object[key];
                    }

                    return promises;
                }, [])).then(_ => document);
        });
    }

}