import {defaultMetadataStorage} from "../metadata-builder/MetadataStorage";
import {WrongAnnotationUsageError} from "./error/WrongAnnotationUsageError";

/**
 * Classes marked within this annotation can be used as "embedded" documents in the documents.
 */
export function EmbeddedDocument() {
    return function (objectConstructor: Function) {

        if (!objectConstructor || !objectConstructor.name)
            throw new WrongAnnotationUsageError('EmbeddedDocument', 'class', objectConstructor);

        defaultMetadataStorage.addDocumentMetadata({
            objectConstructor: objectConstructor,
            name: ''
        });
    };
}
