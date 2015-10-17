export interface UpdateResult {

    /**
     * The number of documents that matched the filter.
     */
    matchedCount?: number;

    /**
     * The number of documents that were modified.
     */
    modifiedCount?: number;

    /**
     * The number of documents upserted.
     */
    upsertedCount?: number;

    /**
     * The upserted id.
     */
    upsertedId?: Object;


}