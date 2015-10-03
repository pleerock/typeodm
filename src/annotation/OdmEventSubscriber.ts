import {defaultMetadataStorage} from "../metadata-builder/MetadataStorage";
import {WrongAnnotationUsageException} from "./exception/WrongAnnotationUsageException";

/**
 * Subscribers that gonna listen to odm events must be annotated with this annotation.
 */
export function OdmEventSubscriber() {
    return function (objectConstructor: Function) {

        if (!objectConstructor || !objectConstructor.name || !(objectConstructor instanceof Function))
            throw new WrongAnnotationUsageException('OdmEventSubscriber', 'class', objectConstructor);

        defaultMetadataStorage.addOdmEventSubscriberMetadata({
            objectConstructor: objectConstructor
        });
    };
}
