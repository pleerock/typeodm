import {ConnectionOptions} from "../connection/ConnectionOptions";

/**
 * Naming strategy defines how auto-generated names for such things like document name, or document column gonna be
 * generated.
 */
export interface NamingStrategy {

    /**
     * Gets the document name from the given class name.
     */
    documentName(className: string): string;

    /**
     * Gets the document's field name from the given property name.
     */
    fieldName(propertyName: string): string;

}