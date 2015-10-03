import {NamingStrategy} from "./NamingStrategy";

/**
 * Naming strategy that is used by default.
 */
export class DefaultNamingStrategy implements NamingStrategy {

    documentName(className: string): string {
        return className;
    }

    fieldName(propertyName: string): string {
        return propertyName;
    }

}
