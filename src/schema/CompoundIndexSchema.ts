import {RelationSchema} from "./RelationSchema";
import {FieldSchema} from "./FieldSchema";

/**
 * Compound Index schema represents information about compound indexes that are used in the documents.
 */
export class CompoundIndexSchema {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _fields: any;
    private _name: string;
    private _unique: boolean;
    private _sparse: boolean;
    private _hashed: boolean;
    private _ttl: number;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(fields: any, name: string, unique: boolean, sparse: boolean, hashed: boolean, ttl: number) {
        this._fields = fields;
        this._name = name;
        this._unique = unique;
        this._sparse = sparse;
        this._hashed = hashed;
        this._ttl = ttl;
    }

    // -------------------------------------------------------------------------
    // Getter Methods
    // -------------------------------------------------------------------------

    get fields(): any {
        return this._fields;
    }

    get name(): string {
        return this._name;
    }

    get unique(): boolean {
        return this._unique;
    }

    get sparse(): boolean {
        return this._sparse;
    }

    get hashed(): boolean {
        return this._hashed;
    }

    get ttl(): number {
        return this._ttl;
    }

}