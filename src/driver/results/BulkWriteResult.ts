export interface BulkWriteResult {

    /**
     * Number of documents inserted.;
     */
    insertedCount?: number;

    /**
     * Number of documents matched for update.
     */
    matchedCount?: number;

    /**
     * Number of documents modified.
     */
    modifiedCount?: number;

    /**
     * Number of documents deleted.
     */
    deletedCount?: number;

    /**
     * Number of documents upserted.
     */
    upsertedCount?: number;

    /**
     * Inserted document generated Id's, hash key is the index of the originating operation
     */
    insertedIds?: Object;

    /**
     * Upserted document generated Id's, hash key is the index of the originating operation
     */
    upsertedIds?: Object;

}