import {defaultMetadataStorage} from "../metadata-builder/MetadataStorage";
import {WrongAnnotationUsageException} from "./exception/WrongAnnotationUsageException";

/**
 * Classes marked within this annotation can provide fields that can be used in a real documents
 * (they gonna be inherited).
 */
export function AbstractDocument() {
    return function (objectConstructor: Function) {

        if (!objectConstructor || !objectConstructor.name)
            throw new WrongAnnotationUsageException('AbstractDocument', 'class', objectConstructor);

        defaultMetadataStorage.addAbstractDocumentMetadata({
            objectConstructor: objectConstructor
        });
    }
}