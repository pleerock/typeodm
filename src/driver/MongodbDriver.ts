import {Driver} from "./Driver";
import {ConnectionOptions} from "../connection/ConnectionOptions";
import * as mongodb from "mongodb";
import {Server, MongoClient, ObjectID} from "mongodb";
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
import {UpdateResult} from "./results/UpdateResult";
import {InsertOneResult} from "./results/InsertOneResult";
import {InsertResult} from "./results/InsertResult";
import {DeleteResult} from "./results/DeleteResult";
import {BulkWriteOptions} from "./options/BulkWriteOptions";
import {BulkWriteOperations} from "./operations/BulkWriteOperations";

/**
 * This driver organizes work with mongodb database.
 */
export class MongodbDriver implements Driver {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private db: any;

    // -------------------------------------------------------------------------
    // Getter Methods
    // -------------------------------------------------------------------------

    get native(): any {
        return this.db;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    connect(options: ConnectionOptions): Promise<any> {
        return new Promise<any>((ok, fail) => {
            MongoClient.connect(options.url, (err: any, db: any) => {
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
        return new Promise<any>((ok, fail) => {
            if (this.db)
                this.db.close();
            ok();
        });
    }

    createObjectId(id?: string): any {
        return new ObjectID(id);
    }

    isObjectId(id: any): boolean {
        return id instanceof ObjectID;
    }

    getIdFieldName(): string {
        return '_id';
    }

    dropDatabase(): Promise<void> {
        return new Promise<void>((ok, fail) => {
            this.db.dropDatabase((err: any, result: any) => err ? fail(err) : ok());
        });
    }

    drop(collection: string): Promise<boolean> {
        return new Promise<boolean>((ok, fail) => {
            this.db.collection(collection).drop((err: any, result: boolean) => err ? fail(err) : ok(result));
        });
    }

    find(collection: string, conditions: Object, options?: FindOptions): Promise<Object[]> {
        if (!options) options = {};
        return new Promise<Object[]>((ok, fail) => {
            let cursor = this.db.collection(collection)
                .find(conditions);

            if (options.skip)
                cursor.skip(options.skip);
            if (options.limit)
                cursor.limit(options.limit);
            if (options.comment)
                cursor.comment(options.comment);
            if (options.min)
                cursor.min(options.min);
            if (options.max)
                cursor.max(options.max);
            if (options.maxScan)
                cursor.maxScan(options.maxScan);
            if (options.batchSize)
                cursor.batchSize(options.batchSize);
            if (options.returnKey)
                cursor.returnKey(options.returnKey);
            if (options.readPreference)
                cursor.readPreference(options.readPreference);
            if (options.sort)
                cursor.readPreference(options.sort);
            if (options.snapshot)
                cursor.snapshot(options.snapshot);

            cursor.toArray((err: any, result: Object[]) => err ? fail(err) : ok(result));
        });
    }

    findOne(collection: string, conditions: Object, options?: FindOptions): Promise<Object> {
        if (!options) options = {};
        options.limit = 1;
        return this.find(collection, conditions, options)
            .then(objects => objects && objects.length ? objects[0] : null);
    }

    findOneById(collection: string, id: string, options?: FindOptions): Promise<Object> {
        let idCondition = { [this.getIdFieldName()]: this.createObjectId(id) };
        return this.findOne(collection, idCondition, options);
    }

    aggregate(collection: string, stages: any[], options?: AggergationOptions): Promise<any> {
        return new Promise<any>((ok, fail) => {
            this.db.collection(collection).aggregate(stages, options, (err: any, result: any) => err ? fail(err) : ok(result));
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

    count(collection: string, criteria: any): Promise<number> {
        return new Promise<number>((ok, fail) => {
            this.db.collection(collection).count(criteria, (err: any, result: number) => err ? fail(err) : ok(result));
        }); // http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~countCallback
    }

    insertOne(collection: string, document: any, options?: InsertOptions): Promise<InsertOneResult> {
        return new Promise<InsertOneResult>((ok, fail) => {
            this.db.collection(collection).insertOne(document, options, (err: any, result: InsertOneResult) => err ? fail(err) : ok(result));
        });
    } // http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~insertOneWriteOpResult

    insertMany(collection: string, document: any, options?: InsertOptions): Promise<InsertResult> {
        return new Promise<InsertResult>((ok, fail) => {
            this.db.collection(collection).insertMany(document, options, (err: any, result: InsertResult) => err ? fail(err) : ok(result));
        });
    } // http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~insertWriteOpCallback

    updateOne(collection: string, query: Object, update: Object, options?: UpdateOptions): Promise<UpdateResult> {
        return new Promise<UpdateResult>((ok, fail) => {
            this.db.collection(collection).updateOne(query, update, options, (err: any, result: UpdateResult) => err ? fail(err) : ok(result));
        }); // http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~updateWriteOpResult
    }

    updateMany(collection: string, query: Object, update: Object, options?: UpdateOptions): Promise<UpdateResult> {
        return new Promise<UpdateResult>((ok, fail) => {
            this.db.collection(collection).updateMany(query, update, options, (err: any, result: UpdateResult) => err ? fail(err) : ok(result));
        }); // http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~updateWriteOpResult
    }

    replaceOne(collection: string, conditions: Object, newObject: Object, options?: ReplaceOptions): Promise<UpdateResult> {
        return new Promise<UpdateResult>((ok, fail) => {
            this.db.collection(collection).replaceOne(conditions, newObject, options, (err: any, result: UpdateResult) => err ? fail(err) : ok(result));
        });
    } // http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~updateWriteOpResult

    deleteOne(collection: string, query: Object, options?: DeleteOptions): Promise<DeleteResult> {
        return new Promise<DeleteResult>((ok, fail) => {
            this.db.collection(collection).deleteOne(query, options, (err: any, result: DeleteResult) => err ? fail(err) : ok(result));
        }); // http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~deleteWriteOpResult
    }

    deleteMany(collection: string, query: Object, options?: DeleteOptions): Promise<DeleteResult> {
        return new Promise<DeleteResult>((ok, fail) => {
            this.db.collection(collection).deleteMany(query, options, (err: any, result: DeleteResult) => err ? fail(err) : ok(result));
        }); // http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~deleteWriteOpResult
    }

    deleteOneById(collection: string, id: any, options?: DeleteOptions): Promise<DeleteResult> {
        return new Promise<DeleteResult>((ok, fail) => {
            let idCondition = { [this.getIdFieldName()]: this.createObjectId(id) };
            this.db.collection(collection).deleteOne(idCondition, options, (err: any, result: DeleteResult) => err ? fail(err) : ok(result));
        }); // http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~deleteWriteOpResult
    }

    distinct(collection: string, key: string, query: Object, options?: DistinctOptions): Promise<any[]> {
        return new Promise<any[]>((ok, fail) => {
            this.db.collection(collection).distinct(key, query, options, (err: any, result: any[]) => err ? fail(err) : ok(result));
        }); // result http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~resultCallback
    }

    findOneAndDelete(collection: string, query: Object, options?: FindOneAndDeleteOptions): Promise<Object> {
        return new Promise<Object>((ok, fail) => {
            this.db.collection(collection).findOneAndDelete(query, options, (err: any, result: any) => err ? fail(err) : ok(result.value));
        });  // result http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~findAndModifyWriteOpResult
    }

    findOneAndReplace(collection: string, query: Object, replacement: Object, options?: FindOneAndReplaceOptions): Promise<Object> {
        return new Promise<Object>((ok, fail) => {
            this.db.collection(collection).findOneAndReplace(query, replacement, options, (err: any, result: any) => err ? fail(err) : ok(result.value));
        });  // result http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~findAndModifyWriteOpResult
    }

    findOneAndUpdate(collection: string, query: Object, update: Object, options?: FindOneAndUpdateOptions): Promise<Object> {
        return new Promise<Object>((ok, fail) => {
            this.db.collection(collection).findOneAndUpdate(query, update, options, (err: any, result: any) => err ? fail(err) : ok(result.value));
        }); // result http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~findAndModifyWriteOpResult
    }

    geoHaystackSearch(collection: string, x: number, y: number, options?: GeoHaystackSearchOptions): Promise<Object[]> {
        return new Promise<Object[]>((ok, fail) => {
            this.db.collection(collection).geoHaystackSearch(x, y, options, (err: any, result: any) => err ? fail(err) : ok(result));
        }); // result http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~resultCallback
    }

    geoNear(collection: string, x: number, y: number, options?: GeoNearOptions): Promise<Object[]> {
        return new Promise<Object[]>((ok, fail) => {
            this.db.collection(collection).geoNear(x, y, options, (err: any, result: any) => err ? fail(err) : ok(result));
            // result http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~resultCallback
        });
    }

    group(collection: string, keys: Object, condition: Object, initial: Object, reduce: Function, finalize: Function, command: boolean, options?: GroupOptions): Promise<any> {
        return new Promise<any>((ok, fail) => {
            this.db.collection(collection).group(keys, condition, initial, reduce, finalize, command, options, (err: any, result: any) => err ? fail(err) : ok(result));
        }); // result http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~resultCallback
    }

    executeOrderedOperations(collection: string, operations: Function, options?: BulkOperationOptions): Promise<BulkWriteResult> {
        let batch = this.db.collection(collection).initializeOrderedBulkOp(options);
        operations();
        return new Promise<BulkWriteResult>((ok, fail) => {
            batch.execute((err: any, result: BulkWriteResult) => err ? fail(err) : ok(result));
        }); // result http://mongodb.github.io/node-mongodb-native/2.0/api/BulkWriteResult.html
    }

    executeUnorderedOperations(collection: string, operations: Function, options?: BulkOperationOptions): Promise<BulkWriteResult> {
        let batch = this.db.collection(collection).initializeUnorderedBulkOp(options);
        operations();
        return new Promise<BulkWriteResult>((ok, fail) => {
            batch.execute((err: any, result: BulkWriteResult) => err ? fail(err) : ok(result));
        }); // result http://mongodb.github.io/node-mongodb-native/2.0/api/BulkWriteResult.html
    }

    bulkWrite(collection: string, operations: BulkWriteOperations, options?: BulkWriteOptions): Promise<any> {
        return new Promise<any>((ok, fail) => {
            this.db.collection(collection).bulkWrite(operations, options, (err: any, result: any) => err ? fail(err) : ok(result));
        }); // result http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~bulkWriteOpCallback
    }

    mapReduce(collection: string, map: Function, reduce: Function, options?: MapReduceOptions): Promise<any> {
        return new Promise<any>((ok, fail) => {
            this.db.collection(collection).mapReduce(map, reduce, options, (err: any, result: any) => err ? fail(err) : ok(result));
        }); // result http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#~resultCallback
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