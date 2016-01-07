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

}
