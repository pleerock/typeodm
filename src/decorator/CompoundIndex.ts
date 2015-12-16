import {defaultMetadataStorage} from "../metadata-builder/MetadataStorage";
import {WrongAnnotationUsageError} from "./error/WrongAnnotationUsageError";
import {IndexOptions} from "./options/IndexOptions";

/**
 * Compound indexes must be set on document classes and must specify fields to be indexed.
 */
export function CompoundIndex(fields: any, options?: IndexOptions) {
    return function (objectConstructor: Function) {

        if (!objectConstructor || !objectConstructor.name)
            throw new WrongAnnotationUsageError('CompoundIndex', 'class', objectConstructor);

        defaultMetadataStorage.addCompoundIndexMetadata({
            objectConstructor: objectConstructor,
            fields: fields,
            name: options ? options.name : undefined,
            unique: !!(options && options.unique),
            sparse: !!(options && options.sparse),
            descendingSort: !!(options && options.descendingSort),
            hashed: !!(options && options.hashed),
            ttl: options ? options.ttl : undefined
        });
    }
}