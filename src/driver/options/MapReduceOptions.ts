export interface MapReduceOptions {

    /**
     * The preferred read preference.
     */
    readPreference?: string;

    /**
     * Sets the output target for the map reduce job. {inline:1} | {replace:'collectionName'} | {merge:'collectionName'} | {reduce:'collectionName'}
     */
    out?: Object;

    /**
     * Query filter object.
     */
    query?: Object;

    /**
     * Sorts the input objects using this key. Useful for optimization, like sorting by the emit key for fewer reduces.
     */
    sort?: Object;

    /**
     * Number of objects to return from collection.
     */
    limit?: number;

    /**
     * Keep temporary data.
     */
    keeptemp?: boolean;

    /**
     * Finalize function.
     */
    finalize?: Function|string;

    /**
     * Can pass in variables that can be access from map/reduce/finalize.
     */
    scope?: Object;

    /**
     * It is possible to make the execution stay in JS. Provided in MongoDB > 2.0.X.
     */
    jsMode?: boolean;

    /**
     * Provide statistics on job execution time.
     */
    verbose?: boolean;

    /**
     * Allow driver to bypass schema validation in MongoDB 3.2 or higher.
     */
    bypassDocumentValidation?: boolean;
}