import {defaultMetadataStorage} from "../metadata-builder/MetadataStorage";
import {WrongAnnotationUsageException} from "./exception/WrongAnnotationUsageException";
import {IndexOptions} from "./options/IndexOptions";

/**
 * Fields that needs to be indexed must be marked with this annotation.
 */
export function Index(options?: IndexOptions) {
    return function (object: Object, propertyName: string) {

        if (!object || !propertyName || !object.constructor)
            throw new WrongAnnotationUsageException('UpdateDate', 'class property', object);

        defaultMetadataStorage.addIndexMetadata({
            object: object,
            propertyName: propertyName,
            name: options ? options.name : undefined,
            unique: !!(options && options.unique),
            sparse: !!(options && options.sparse),
            descendingSort: !!(options && options.descendingSort),
            hashed: !!(options && options.hashed),
            ttl: options ? options.ttl : undefined
        });
    };
}