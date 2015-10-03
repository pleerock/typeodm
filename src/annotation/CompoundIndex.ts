import {defaultMetadataStorage} from "../metadata-builder/MetadataStorage";
import {WrongAnnotationUsageException} from "./exception/WrongAnnotationUsageException";
import {IndexOptions} from "./options/IndexOptions";

/**
 * Compound indexes must be set on document classes and must specify fields to be indexed.
 */
export function CompoundIndex(fields: any, options?: IndexOptions) {
    return function (objectConstructor: Function) {

        if (!objectConstructor || !objectConstructor.name || !(objectConstructor instanceof Function))
            throw new WrongAnnotationUsageException('CompoundIndex', 'class', objectConstructor);

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
    };
}