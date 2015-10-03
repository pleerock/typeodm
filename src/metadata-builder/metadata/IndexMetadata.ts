import {ObjectPropertyMetadata} from "./ObjectPropertyMetadata";

/**
 * This metadata interface contains all information about some index on a field.
 */
export interface IndexMetadata extends ObjectPropertyMetadata {

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