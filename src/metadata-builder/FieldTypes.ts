import {FieldTypeInFunction} from "./metadata/FieldMetadata";

/**
 * Lists all types that can be a document field.
 */
export class FieldTypes {

    // todo: use only common types, not specific to mongodb, add support for custom database type

    static NUMBER = 'number';
    static DOUBLE = 'double';
    static STRING = 'string';
    static OBJECT = 'object';
    static ARRAY = 'array';
    static BINARY = 'binary';
    static OBJECTID = 'objectid';
    static BOOLEAN = 'boolean';
    static DATE = 'date';
    static NULL = 'null';
    static REGEXP = 'regexp';
    static JS = 'js';
    static SYMBOL = 'symbol';
    static JS_SCOPE = 'js_scope';
    static INT_32 = 'int_32';
    static TIMESTAMP = 'timestamp';
    static INT_64 = 'int_64';

    static isTypeSupported(type: string): boolean {
        switch (type) {
            case this.DOUBLE:
            case this.NUMBER:
            case this.STRING:
            case this.OBJECT:
            case this.ARRAY:
            case this.BINARY:
            case this.OBJECTID:
            case this.BOOLEAN:
            case this.DATE:
            case this.NULL:
            case this.REGEXP:
            case this.JS:
            case this.SYMBOL:
            case this.JS_SCOPE:
            case this.INT_32:
            case this.TIMESTAMP:
            case this.INT_64:
                return true;
        }
        return false;
    }

    static validateTypeInFunction(typeFunction: FieldTypeInFunction): boolean {
        if (!typeFunction || typeof typeFunction !== 'function')
            return false;

        let type = typeFunction();
        if (!type)
            return false;

        if (typeof type === 'string' && !FieldTypes.isTypeSupported(type))
            return false;

        return true;
    }

}