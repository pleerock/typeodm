/**
 * Options can be passed to the Index annotation.
 */
export interface IndexOptions {
    name?: string;
    unique?: boolean;
    sparse?: boolean;
    descendingSort?: boolean;
    hashed?: boolean;
    ttl?: number;
}
