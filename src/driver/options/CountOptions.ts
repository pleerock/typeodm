export interface CountOptions {

    /**
     * The limit of documents to count.
     */
    limit?: number;

    /**
     * The number of documents to skip for the count.
     */
    skip?: number;

    /**
     * An index name hint for the query.
     */
    hint?: string;

    /**
     * The preferred read preference.
     */
    readPreference?: string;

}