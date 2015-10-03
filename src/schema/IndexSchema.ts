import {RelationSchema} from "./RelationSchema";
import {FieldSchema} from "./FieldSchema";

/**
 * Index schema represents information about some field that needs to be indexed.
 */
export class IndexSchema {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _name: string;
    private _unique: boolean;
    private _sparse: boolean;
    private _descendingSort: boolean;
    private _hashed: boolean;
    private _ttl: number;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(name: string, unique: boolean, sparse: boolean, descendingSort: boolean, hashed: boolean, ttl: number) {
        this._name = name;
        this._unique = unique;
        this._sparse = sparse;
        this._descendingSort = descendingSort;
        this._hashed = hashed;
        this._ttl = ttl;
    }

    // -------------------------------------------------------------------------
    // Getter Methods
    // -------------------------------------------------------------------------

    get name(): string {
        return this._name;
    }

    get unique(): boolean {
        return this._unique;
    }

    get sparse(): boolean {
        return this._sparse;
    }

    get descendingSort(): boolean {
        return this._descendingSort;
    }

    get hashed(): boolean {
        return this._hashed;
    }

    get ttl(): number {
        return this._ttl;
    }

}