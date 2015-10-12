import {DocumentSchema} from "./DocumentSchema";
import {RelationMetadata} from "../metadata-builder/metadata/RelationMetadata";

/**
 * Relation schema represents a document's relation structure and properties.
 */
export class RelationSchema {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _name: string;
    private _propertyName: string;
    private _type: Function;
    private _inverseSideProperty: string;
    private _isCascadeInsert: boolean;
    private _isCascadeUpdate: boolean;
    private _isCascadeRemove: boolean;
    private _isAlwaysLeftJoin: boolean;
    private _isAlwaysInnerJoin: boolean;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(name: string,
                type: Function, // todo: can it really be a string?
                propertyName: string,
                inverseSidePropertyName: string,
                isCascadeInsert: boolean,
                isCascadeUpdate: boolean,
                isCascadeRemove: boolean,
                isAlwaysLeftJoin: boolean,
                isAlwaysInnerJoin: boolean) {
        this._name = name;
        this._propertyName = propertyName;
        this._type = type;
        this._inverseSideProperty = inverseSidePropertyName;
        this._isCascadeInsert = isCascadeInsert;
        this._isCascadeUpdate = isCascadeUpdate;
        this._isCascadeRemove = isCascadeRemove;
        this._isAlwaysLeftJoin = isAlwaysLeftJoin;
        this._isAlwaysInnerJoin = isAlwaysInnerJoin;
    }

    // -------------------------------------------------------------------------
    // Getter Methods
    // -------------------------------------------------------------------------

    get name(): string {
        return this._name;
    }

    get propertyName(): string {
        return this._propertyName;
    }

    get type(): Function {
        return this._type;
    }

    get inverseSideProperty(): string {
        return this._inverseSideProperty;
    }

    get isCascadeInsert(): boolean {
        return this._isCascadeInsert;
    }

    get isCascadeUpdate(): boolean {
        return this._isCascadeUpdate;
    }

    get isCascadeRemove(): boolean {
        return this._isCascadeRemove;
    }

    get isAlwaysLeftJoin(): boolean {
        return this._isAlwaysLeftJoin;
    }

    get isAlwaysInnerJoin(): boolean {
        return this._isAlwaysInnerJoin;
    }

}