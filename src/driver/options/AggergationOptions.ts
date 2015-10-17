export interface AggergationOptions {

    /**
     * Explain returns the aggregation execution plan.
     */
    explain?: boolean;

    /**
     * Lets the server know if it can use disk to store temporary results for the aggregation (requires mongodb 2.6 >).
     */
    allowDiskUse?: boolean;

    /**
     * Specifies a cumulative time limit in milliseconds for processing operations on the cursor. MongoDB interrupts the operation at the earliest following interrupt point.
     */
    maxTimeMS?: number;

    /**
     * Allow driver to bypass schema validation in MongoDB 3.2 or higher.
     */
    bypassDocumentValidation?: boolean;

}