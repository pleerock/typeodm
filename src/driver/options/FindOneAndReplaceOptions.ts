export interface FindOneAndReplaceOptions {

    /**
     * Limits the fields to return for all matching documents.
     */
    projection?: Object;

    /**
     * Determines which document the operation modifies if the query selects multiple documents.
     */
    sort?: Object;

    /**
     * The maximum amount of time to allow the query to run.
     */
    maxTimeMS?: number;

    /**
     * Upsert the document if it does not exist.
     */
    upsert?: boolean;

    /**
     * When false, returns the updated document rather than the original. The default is true.
     */
    returnOriginal?: boolean;

}