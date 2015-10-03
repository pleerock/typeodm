export class MetadataAlreadyExistsException extends Error {

    constructor(metadataType: string, constructor: Function, propertyName?: string) {
        super();
        this.message = metadataType + ' metadata already exists for the class constructor ' + JSON.stringify(constructor) +
            (propertyName ? ' on property ' + propertyName : '');
    }

}