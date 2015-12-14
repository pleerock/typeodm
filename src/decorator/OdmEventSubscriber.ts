import {defaultMetadataStorage} from "../metadata-builder/MetadataStorage";
import {WrongAnnotationUsageError} from "./error/WrongAnnotationUsageError";

/**
 * Subscribers that gonna listen to odm events must be annotated with this annotation.
 */
export function OdmEventSubscriber() {
    return function (objectConstructor: Function) {

        if (!objectConstructor || !objectConstructor.name)
            throw new WrongAnnotationUsageError('OdmEventSubscriber', 'class', objectConstructor);

        defaultMetadataStorage.addOdmEventSubscriberMetadata({
            objectConstructor: objectConstructor
        });
    };
}
