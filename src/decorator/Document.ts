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
    }
}

/**
 * Classes marked within this annotation can provide fields that can be used in a real documents
 * (they gonna be inherited).
 */
export function AbstractDocument() {
    return function (objectConstructor: Function) {

        if (!objectConstructor || !objectConstructor.name)
            throw new WrongAnnotationUsageError('AbstractDocument', 'class', objectConstructor);

        defaultMetadataStorage.addAbstractDocumentMetadata({
            objectConstructor: objectConstructor
        });
    }
}