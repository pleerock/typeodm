import {defaultMetadataStorage} from "../metadata-builder/MetadataStorage";
import {WrongAnnotationUsageException} from "./exception/WrongAnnotationUsageException";

/**
 * Classes marked within this annotation can be used as "embedded" documents in the documents.
 */
export function EmbeddedDocument() {
    return function (objectConstructor: Function) {

        if (!objectConstructor || !objectConstructor.name)
            throw new WrongAnnotationUsageException('EmbeddedDocument', 'class', objectConstructor);

        defaultMetadataStorage.addDocumentMetadata({
            objectConstructor: objectConstructor,
            name: ''
        });
    };
}
