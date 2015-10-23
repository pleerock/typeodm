import {defaultMetadataStorage} from "../metadata-builder/MetadataStorage";
import {WrongAnnotationUsageException} from "./exception/WrongAnnotationUsageException";
import {MetadataAlreadyExistsException} from "../metadata-builder/exception/MetadataAlreadyExistsException";

/**
 * This annotation is used to mark classes that they gonna be Documents.
 */
export function Document(name?: string) {
    return function (objectConstructor: Function) {

        if (!objectConstructor || !objectConstructor.name)
            throw new WrongAnnotationUsageException('Document', 'class', objectConstructor);

        defaultMetadataStorage.addDocumentMetadata({
            objectConstructor: objectConstructor,
            name: name
        });
    };
}