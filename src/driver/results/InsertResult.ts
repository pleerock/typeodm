export interface InsertResult {

    /**
     * The total amount of documents inserted.
     */
    insertedCount: number;

    /**
     * All the generated _id's for the inserted documents.
     */
    insertedIds?: any[]; // ObjectId

}