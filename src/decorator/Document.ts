import {defaultMetadataStorage} from "../metadata-builder/MetadataStorage";
import {WrongAnnotationUsageError} from "./error/WrongAnnotationUsageError";
import {MetadataAlreadyExistsError} from "../metadata-builder/error/MetadataAlreadyExistsError";

/**
 * This annotation is used to mark classes that they gonna be Documents.
 */
export function Document(name: string) {
    return function (objectConstructor: Function) {

        if (!objectConstructor || !objectConstructor.name)
            throw new WrongAnnotationUsageError('Document', 'class', objectConstructor);

        defaultMetadataStorage.addDocumentMetadata({
            objectConstructor: objectConstructor,
            name: name
        });
    }
}