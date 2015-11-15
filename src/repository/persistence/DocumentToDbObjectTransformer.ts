import {DocumentSchema} from "../../schema/DocumentSchema";
import {Connection} from "../../connection/Connection";
import {RelationSchema} from "../../schema/RelationSchema";
import {CascadeOption, DynamicCascadeOptions} from "./../cascade/CascadeOption";
import {WrongFieldTypeInDocumentException} from "../exception/WrongFieldTypeInDocumentException";
import {DbObjectFieldValidator} from "./DbObjectFieldValidator";
import {FieldTypeNotSupportedException} from "../exception/FieldTypeNotSupportedException";
import {PersistOperation} from "./../operation/PersistOperation";
import {CascadeOptionUtils} from "../cascade/CascadeOptionUtils";

/**
 * Makes a transformation of a given document to the document that can be saved to the db.
 */
export class DocumentToDbObjectTransformer<Document> {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private connection: Connection;
    private _persistOperations: PersistOperation[];
    private _postPersistOperations: Function[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(connection: Connection) {
        this.connection = connection;
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    get postPersistOperations() {
        return this._postPersistOperations;
    }

    get persistOperations() {
        return this._persistOperations;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Transforms given document into object that can be persisted into the db.
     */
    transform(schema: DocumentSchema,
              document: Document,
              cascadeOptionsInCallback?: DynamicCascadeOptions<Document>): Object {

        this._persistOperations = [];
        this._postPersistOperations = [];
        return this.documentToDbObject(0, schema, document, cascadeOptionsInCallback)
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private prepareDocumentValues(schema: DocumentSchema, document: Document|any) {
        if (schema.createDateField && !schema.getDocumentId(document))
            document[schema.createDateField.propertyName] = new Date();

        if (schema.updateDateField)
            document[schema.updateDateField.propertyName] = new Date();
    }

    private documentToDbObject(deepness: number,
                               schema: DocumentSchema,
                               document: Document,
                               cascadeOptionsInCallback?: DynamicCascadeOptions<Document>): Object {

        this.prepareDocumentValues(schema, document);
        let cascadeOptions = CascadeOptionUtils.prepareCascadeOptions(schema, cascadeOptionsInCallback);
        var dbObject = {};
        Object.keys(document).forEach(propertyName => {
            let cascadeOption = CascadeOptionUtils.find(cascadeOptions, propertyName);

            if (schema.hasFieldWithPropertyName(propertyName) && !schema.isFieldId(propertyName))
                this.parseField(deepness, schema, dbObject, document, propertyName);

            if (schema.hasRelationWithOneWithPropertyName(propertyName))
                this.parseRelationWithOne(deepness, schema, dbObject, document, propertyName, cascadeOption);

            if (schema.hasRelationWithManyWithPropertyName(propertyName))
                this.parseRelationWithMany(deepness, schema, dbObject, document, propertyName, cascadeOption);
        });
        return dbObject;
    }

    private parseField(deepness: number, schema: DocumentSchema, dbObject: Object|any, document: any, propertyName: string) {
        let dbField = schema.findFieldByPropertyName(propertyName);
        let fieldTypeSchema = dbField.isTypeDocument() ? this.connection.getSchema(<Function> dbField.type) : null;

        if (dbField.isArray && document[propertyName] instanceof Array) {

            if (dbField.isTypeDocument()) {
                dbObject[propertyName] = document[propertyName].map((item: any) => this.parseEmbedType(deepness, fieldTypeSchema, item));
            } else {

                if (!DbObjectFieldValidator.isTypeSupported(<string> dbField.type)) // todo: this should not be possible. type check should be on schema build
                    throw new FieldTypeNotSupportedException(dbField.type + '[]', propertyName, document);

                if (!DbObjectFieldValidator.validateArray(document[propertyName], <string> dbField.type))
                    throw new WrongFieldTypeInDocumentException(dbField.type + '[]', propertyName, document);

                dbObject[propertyName] = document[propertyName];
            }

        } else if (dbField.isTypeDocument()) {
            dbObject[propertyName] = this.parseEmbedType(deepness, fieldTypeSchema, document[propertyName]);

        } else {
            if (document[propertyName] !== null && document[propertyName] !== undefined) { // skip validation for properties without value
                if (!DbObjectFieldValidator.isTypeSupported(<string> dbField.type)) // todo: this should not be possible. type check should be on schema build
                    throw new FieldTypeNotSupportedException(dbField.type, propertyName, document);

                if (!DbObjectFieldValidator.validate(document[propertyName], <string> dbField.type))
                    throw new WrongFieldTypeInDocumentException(dbField.type, propertyName, document);
            }

            dbObject[dbField.name] = document[propertyName];
        }
    }

    private parseEmbedType(deepness: number, schema: DocumentSchema, embeddedDocument: Document|any) {
        let idField = schema.idField;
        let embed: any = this.documentToDbObject(deepness + 1, schema, embeddedDocument);
        if (idField) {
            embed[this.connection.driver.getIdFieldName()] = this.createObjectId(embeddedDocument[idField.name], schema);
            this._postPersistOperations.push(() => embeddedDocument[idField.name] = String(embed[this.connection.driver.getIdFieldName()]));
        }
        return embed;
    }

    private parseRelationWithOne(deepness: number,
                                 schema: DocumentSchema,
                                 dbObject: Object|any,
                                 document: any,
                                 fieldName: any,
                                 cascadeOption?: CascadeOption) {

        let relation = schema.findRelationWithOneByPropertyName(fieldName);
        let addFunction = (id: any) => dbObject[relation.name] = id;
        this.parseRelation(deepness, schema, document, relation, document[fieldName], addFunction, cascadeOption);
    }


    private parseRelationWithMany(  deepness: number,
                                    schema: DocumentSchema,
                                    dbObject: Object|any,
                                    document: any,
                                    fieldName: any,
                                    cascadeOption?: CascadeOption) {

        let relation = schema.findRelationWithManyByPropertyName(fieldName);
        let addFunction = (id: any) => dbObject[relation.name].push(id);

        dbObject[relation.name] = [];
        document[fieldName].forEach((fieldItem: any) => {
            this.parseRelation(deepness, schema, document, relation, fieldItem, addFunction, cascadeOption);
        });
    }

    private parseRelation(deepness: number,
                          schema: DocumentSchema,
                          document: any,
                          relation: RelationSchema,
                          value: any,
                          addFunction: (objectId: any) => void,
                          cascadeOption?: CascadeOption) {

        let relationTypeSchema = this.connection.getSchema(<Function> relation.type);
        let relatedDocumentId = value ? relationTypeSchema.getDocumentId(value) : null;

        if (relatedDocumentId && !CascadeOptionUtils.isCascadeUpdate(relation, cascadeOption)) {
            addFunction(this.createObjectId(relatedDocumentId, relationTypeSchema));

        } else if (value) {
            // check if we already added this object for persist (can happen when object of the same instance is used in different places)
            let operationOnThisValue = this._persistOperations.reduce((found, operation) => operation.document === value ? operation : found, null);
            let subCascades = cascadeOption ? cascadeOption.cascades : undefined;
            let relatedDbObject = this.documentToDbObject(deepness + 1, relationTypeSchema, value, subCascades);
            let doPersist = CascadeOptionUtils.isCascadePersist(relation, cascadeOption);

            let afterExecution = (insertedRelationDocument: any) => {
                let id = relationTypeSchema.getDocumentId(insertedRelationDocument);
                addFunction(this.createObjectId(id, relationTypeSchema));
                return {
                    inverseSideDocumentId: id,
                    inverseSideDocumentSchema: relationTypeSchema,
                    inverseSideDocumentProperty: relation.inverseSideProperty,
                    documentSchema: schema,
                    documentId: schema.getDocumentId(document)
                };
            };

            if (!operationOnThisValue) {
                operationOnThisValue = {
                    allowedPersist: false,
                    deepness: deepness,
                    document: value,
                    schema: relationTypeSchema,
                    dbObject: relatedDbObject,
                    afterExecution: []
                };
                this._persistOperations.push(operationOnThisValue);
            }

            // this check is required because we check
            operationOnThisValue.afterExecution.push(afterExecution);
            operationOnThisValue.allowedPersist = operationOnThisValue.allowedPersist || doPersist;
        }
    }

    private createObjectId(id: string, schema: DocumentSchema): any {
        return this.connection.driver.createObjectId(id, schema.idField.isObjectId);
    }

}