/**
 * Connection options passed to the document.
 */
export interface ConnectionOptions {

    /**
     * Url to where perform connection.
     */
    url: string;

    /**
     * Prefix to be used before each collection.
     */
    collectionPrefix?: string;

    /**
     * If set to true then odm will automatically run ensureIndex for all defined indices on creation.
     */
    autoIndex?: boolean;

}
