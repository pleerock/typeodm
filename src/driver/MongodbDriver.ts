import {Driver} from "./Driver";
import {ConnectionOptions} from "../connection/ConnectionOptions";

/**
 * This driver organizes work with mongodb database.
 */
export class MongodbDriver implements Driver {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private mongodb: any;
    private db: any;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(mongodb: any) {
        this.mongodb = mongodb;
    }

    // -------------------------------------------------------------------------
    // Getter Methods
    // -------------------------------------------------------------------------

    get native(): any {
        return this.mongodb;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    connect(options: ConnectionOptions): Promise<any> {
        return new Promise<Object>((ok, fail) => {
            this.mongodb.MongoClient.connect(options.url, (err: any, db: any) => {
                if (err) {
                    fail(err);
                    return;
                }
                this.db = db;
                ok();
            });
        });
    }

    closeConnection(): Promise<any> {
        return new Promise<Object>((ok, fail) => {
            if (!this.db) {
                fail('No connection is opened');
                return;
            }
            this.db.close();
            ok();
        });
    }

    insert(collection: string, document: any): Promise<any> {
        return new Promise<Object>((ok, fail) => {
            this.db.collection(collection).insert([document], (err: any, result: any) => err ? fail(err) : ok(result.ops[0]));
        });
    }

    bulkInsert(collection: string, documents: any[]): Promise<any[]> {
        return new Promise<Object[]>((ok, fail) => {
            this.db.collection(collection).insert(documents, (err: any, result: any) => err ? fail(err) : ok(result.ops));
        });
    }

    update(collection: string, conditions: Object, updateOptions?: Object): Promise<any> {
        return new Promise<Object>((ok, fail) => {
            this.db.collection(collection).updateOne(conditions, updateOptions, (err: any, result: any) => err ? fail(err) : ok());
        });
    }

    replace(collection: string, conditions: Object, newObject: Object): Promise<any> {
        return new Promise<Object>((ok, fail) => {
            this.db.collection(collection).replaceOne(conditions, newObject, (err: any, result: any) => err ? fail(err) : ok(result.ops));
        });
    }

    remove(collection: string, conditions: Object): Promise<any> {
        return new Promise<any>((ok, fail) => {
            this.db.collection(collection).remove(conditions, (err: any, result: any) => err ? fail(err) : ok(result));
        });
    }

    removeById(collection: string, id: string): Promise<any> {
        return new Promise<any>((ok, fail) => {
            let idCondition = { [this.getIdFieldName()]: this.createObjectId(id) };
            this.db.collection(collection).remove(idCondition, (err: any, result: any) => err ? fail(err) : ok(result));
        });
    }

    find(collection: string, conditions: Object): Promise<Object[]> {
        return new Promise<Object[]>((ok, fail) => {
            this.db.collection(collection).find(conditions).toArray((err: any, result: any) => err ? fail(err) : ok(result));
        });
    }

    findOne(collection: string, conditions: Object): Promise<Object> {
        return new Promise<Object>((ok, fail) => {
            this.db.collection(collection).findOne(conditions, (err: any, result: any) => err ? fail(err) : ok(result));
        });
    }

    findById(collection: string, id: string): Promise<Object> {
        let idCondition = { [this.getIdFieldName()]: this.createObjectId(id) };
        return new Promise<Object>((ok, fail) => {
            this.db.collection(collection).findOne(idCondition, (err: any, result: any) => err ? fail(err) : ok(result));
        });
    }

    createObjectId(id?: string): any {
        return new this.mongodb.ObjectId(id);
    }

    isObjectId(id: any): boolean {
        return id instanceof this.mongodb.ObjectId;
    }

    aggregate(collection: string, stages: any[]): Promise<any> {
        return this.db.collection(collection).aggregate(stages);
    }

    getIdFieldName(): string {
        return '_id';
    }

    drop(collection?: string): Promise<void> {
        return new Promise<void>((ok, fail) => {
            if (collection)
                this.db.collection(collection).drop((err: any, result: any) => err ? fail(err) : ok(result));
            else
                this.db.dropDatabase((err: any, result: any) => err ? fail(err) : ok(result));
        });
    }

    setOneRelation(collection: string, documentId: any, relationPropertyName: string, relationPropertyValue: any): Promise<void> {
        return new Promise<void>((ok, fail) => {
            let conditions = { $unset: { [relationPropertyName]: relationPropertyValue } };
            this.db.collection(collection).updateOne(conditions, null, (err: any, result: any) => err ? fail(err) : ok());
        });
    }

    setManyRelation(collection: string, documentId: any, relationPropertyName: string, relationPropertyValue: any): Promise<void> {
        return new Promise<void>((ok, fail) => {
            let conditions = { $pull: { [relationPropertyName]: relationPropertyValue } };
            this.db.collection(collection).updateOne(conditions, null, (err: any, result: any) => err ? fail(err) : ok());
        });
    }

    unsetOneRelation(collection: string, documentId: any, relationPropertyName: string, relationPropertyValue: any): Promise<void> {
        return new Promise<void>((ok, fail) => {
            let conditions = { $set: { [relationPropertyName]: relationPropertyValue } };
            this.db.collection(collection).updateOne(conditions, null, (err: any, result: any) => err ? fail(err) : ok());
        });
    }

    unsetManyRelation(collection: string, documentId: any, relationPropertyName: string, relationPropertyValue: any): Promise<void> {
        return new Promise<void>((ok, fail) => {
            let conditions = { $addToSet: { [relationPropertyName]: relationPropertyValue } };
            this.db.collection(collection).updateOne(conditions, null, (err: any, result: any) => err ? fail(err) : ok());
        });
    }

    createIndex(collection: string, keys: any, options: any): Promise<void> {
        return new Promise<void>((ok, fail) => {
            this.db.collection(collection).createIndex(keys, options, (err: any, result: any) => err ? fail(err) : ok());
        });
    }

}

/**
 * Types that field metadata can have.
 */
export enum MongodbSupportedTypes {
    DOUBLE = 1,
    STRING = 2,
    OBJECT = 3,
    ARRAY = 4,
    BINARY = 5,
    OBJECTID = 7,
    BOOLEAN = 8,
    DATE = 9,
    NULL = 10,
    REGEXP = 11,
    JS = 13,
    SYMBOL = 14,
    JS_SCOPE = 15,
    INT_32 = 16,
    TIMESTAMP = 17,
    INT_64 = 18
}