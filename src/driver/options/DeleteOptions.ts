export interface DeleteOptions {

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
     * Allow driver to bypass schema validation in MongoDB 3.2 or higher.
     */
    bypassDocumentValidation?: boolean;
}