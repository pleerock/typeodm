export interface InsertOneResult {

    /**
     * The total amount of documents inserted.
     */
    insertedCount: number;

    /**
     * The number of documents that matched the filter.
     */
    insertedId?: any; // ObjectId

}