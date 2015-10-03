import {ObjectPropertyMetadata} from "./ObjectPropertyMetadata";

/**
 * This metadata interface contains all information about compound index on a document.
 */
export interface CompoundIndexMetadata {

    /**
     * Document to which this index is attached.
     */
    objectConstructor: Function;

    /**
     * Fields combination to be used as index.
     */
    fields: any;

    /**
     * The name of the index.
     */
    name?: string;

    /**
     * Indicates if this index is unique or not.
     */
    unique?: boolean;

    /**
     * Indicates if this index is sparse or not.
     */
    sparse?: boolean;

    /**
     * If this set to true the descending sorting gonna be used for this index.
     */
    descendingSort?: boolean;

    /**
     * Indicates if this index is hashed or not.
     */
    hashed?: boolean;

    /**
     * Sets the TTL for this index.
     */
    ttl?: number;

}