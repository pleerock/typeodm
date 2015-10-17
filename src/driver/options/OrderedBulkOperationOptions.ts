export interface BulkOperationOptions {

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

}