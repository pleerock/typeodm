export interface InsertOptions {

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
     * Force server to assign _id values instead of driver.
     */
    forceServerObjectId?: boolean;

    /**
     * Allow driver to bypass schema validation in MongoDB 3.2 or higher.
     */
    bypassDocumentValidation?: boolean;
}