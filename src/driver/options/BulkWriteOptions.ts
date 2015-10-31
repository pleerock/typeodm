export interface BulkWriteOptions {

    /**
     * The write concern.
     */
    w?: any;

    /**
     * The write concern timeout.
     */
    wtimeout?: number;

    /**
     * Specify a journal write concern.
     */
    j?: boolean;

    /**
     * Serialize functions on any object.
     */
    serializeFunctions?: boolean;

    /**
     * Execute write operation in ordered or unordered fashion.
     */
    ordered?: boolean;

    /**
     * Allow driver to bypass schema validation in MongoDB 3.2 or higher.
     */
    bypassDocumentValidation?: boolean;

}
