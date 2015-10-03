import {ObjectPropertyMetadata} from "./ObjectPropertyMetadata";

/**
 * Function that returns a type of the field. Returned value should be some class within which this relation is being created.
 */
export type RelationTypeInFunction = ((type?: any) => Function);

/**
 * Contains the name of the property of the object, or the function that returns this name.
 */
export type PropertyTypeInFunction<T> = string|((t: T) => string|any);

/**
 * This metadata interface contains all information about some document's relation.
 */
export interface RelationMetadata extends ObjectPropertyMetadata {

    /**
     * Field name to be used in the database.
     */
    name?: string;

    /**
     * The type of the field. With the type that is returned by this function connection will be made.
     */
    type: RelationTypeInFunction;

    /**
     * The property name on the other side of relation, within which connection will be performed.
     */
    inverseSide?: PropertyTypeInFunction<any>;

    /**
     * If set to true then it means that related object can be allowed to be inserted to the db.
     */
    isCascadeInsert: boolean;

    /**
     * If set to true then it means that related object can be allowed to be updated in the db.
     */
    isCascadeUpdate: boolean;

    /**
     * If set to true then it means that related object can be allowed to be remove from the db.
     */
    isCascadeRemove: boolean;

    /**
     * If set to true then it means that related object always will be left-joined when this object is being loaded.
     */
    isAlwaysLeftJoin: boolean;

    /**
     * If set to true then it means that related object always will be inner-joined when this object is being loaded.
     */
    isAlwaysInnerJoin: boolean;
}